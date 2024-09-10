'use server';

import { z } from 'zod';
import { db } from '@/db/db';
import { User, user } from '@/db/schema';
import { and, eq } from 'drizzle-orm'
import { generateIdFromEntropySize, Scrypt } from 'lucia';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { lucia } from '@/db/lucia';
import { cache } from 'react';

const scrypt = new Scrypt();

const FormUser = z.object({
    username: z.string(),
    password: z.string()
});

const provider = "username";

export async function signUp(formData: FormData) {
    const { username, password } = FormUser.parse({
        username: formData.get("id"),
        password: formData.get("password")
    });

    try {
        const existingUser = await db.select({ id: user.id }).from(user)
            .where(and(eq(user.username, username), eq(user.provider, provider)));
        if (existingUser.length !== 0) return { error: "같은 ID가 있습니다." };

        const id = generateIdFromEntropySize(10)
        await db.insert(user).values({
            id: id, username: username,
            password: await scrypt.hash(password),
            provider: provider
        });

        const session = await lucia.createSession(id, {});
        const sessionCookie = await lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        console.log(session, sessionCookie);
    } catch (error) {
        return { error: "회원가입 실패" };
    }

    redirect("/");
}

export async function signIn(formData: FormData) {
    const { username, password } = FormUser.parse({
        username: formData.get("id"),
        password: formData.get("password")
    });

    try {
        const existingUser = await db.select({
            id: user.id,
            passwordHash: user.password
        }).from(user).where(and(eq(user.username, username), eq(user.provider, provider)));

        const passwordHash = existingUser[0]?.passwordHash ?? null;
        if (!passwordHash) return { error: "아이디 혹은 비밀번호가 잘못되었습니다." };

        const validPassword = await scrypt.verify(passwordHash, password) ?? null;
        if (!validPassword) return { error: "아이디 혹은 비밀번호가 잘못되었습니다." };

        const id = existingUser[0]?.id ?? null;
        const session = await lucia.createSession(id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    } catch (error) {
        return { error: "로그인 실패" };
    }

    redirect("/");
}

export async function signOut() {
    const sessionId = (await verifySession()).session?.id ?? null;
    if (!sessionId) return { error: "유효하지 않은 세션" };

    await lucia.invalidateSession(sessionId);

    const sessionCookie = lucia.createBlankSessionCookie();
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

    redirect("/signin");
}

export const verifySession = cache(async () => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) return {
        user: null,
        session: null
    };

    const { user, session } = await lucia.validateSession(sessionId);
    try {
        if (session && session.fresh) {
            const sessionCookie = lucia.createSessionCookie(session.id);
            cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
        }
    } catch (error) {
        throw new Error("유효하지 않은 세션");
    }

    return { user, session };
});

export async function fetchUsers(): Promise<User[]> {
    const response = await fetch('http://localhost:3000/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
                query {
                    user {
                        id
                        username
                        profile_image
                    }
                }
            `
        })
    });

    const result = await response.json();
    if (result.errors) {
        throw new Error("유저 목록 조회 실패")
    }

    return result.data.user;
}