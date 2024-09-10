import { generateState } from "arctic";
import { kakao } from "@/db/lucia";
import { cookies } from "next/headers";

const oneHour = 3600;

export async function GET() {
    const state = generateState();
    const url = await kakao.createAuthorizationURL(state);

    cookies().set("kakao_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: oneHour
    })

    return Response.redirect(url);
}