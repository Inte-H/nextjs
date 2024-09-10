import { Lucia, Scrypt } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db/db";

import { session, user, SelectUser } from "./schema";
import { Kakao } from "arctic";

const adapter = new DrizzlePostgreSQLAdapter(db, session, user);

export const scrypt = new Scrypt();
export const kakao = new Kakao(process.env.KAKAO_CLIENT_ID!, process.env.KAKAO_CLIENT_SECRET!, process.env.KAKAO_REDIRECT_URL!);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production"
		}
	},
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			username: attributes.username,
			profile_image: attributes.profile_image,
			isAdmin: attributes.isAdmin,
		};
	}
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: SelectUser;
	}
}