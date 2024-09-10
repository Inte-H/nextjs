import { db } from "@/db/db";
import { kakao, lucia } from "@/db/lucia";
import { user } from "@/db/schema";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const provider = "kakao";

export async function GET(request: Request) {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = cookies().get("kakao_oauth_state")?.value ?? null;

    if (!code || !state || !storedState || state !== storedState) {
        return new Response(null, {
            status: 400
        });
    }

    try {
        const tokens = await kakao.validateAuthorizationCode(code);
        const response = await fetch("https://kapi.kakao.com/v2/user/me", {
            headers: {
                Authorization: `Bearer ${tokens.accessToken}`
            }
        });
        const kakaoUser = await response.json();

        const existingUser = await db.select().from(user)
            .where(eq(user.username, kakaoUser.properties.nickname) && eq(user.provider, provider));

        if (existingUser.length !== 0) {
            const session = await lucia.createSession(existingUser[0].id, {});
            const sessionCookie = await lucia.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

            return new Response(null, {
                status: 302,
                headers: {
                    Location: "/"
                }
            });
        }

        const id = kakaoUser.id.toString();
        await db.insert(user).values({
            id: id,
            username: kakaoUser.properties.nickname,
            profile_image: kakaoUser.properties.thumbnail_image,
            provider: provider
        });

        const session = await lucia.createSession(id, {});
        const sessionCookie = await lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

        return new Response(null, {
            status: 302,
            headers: {
                Location: "/"
            }
        });
    } catch (error) {
        if (error instanceof OAuth2RequestError) {
            return new Response(error.description, { status: 400 });
        }

        return new Response("뭔가 잘못되었습니다!", { status: 500 });
    }
}