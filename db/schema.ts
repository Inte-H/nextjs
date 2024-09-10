import { InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("users", {
	id: text("id").primaryKey()
		.notNull()
		.unique(),
	username: text("username").notNull(),
	profile_image: text("profile_image"),
	password: text("password"),
	isAdmin: boolean("admin").default(false),
	provider: text("provider").notNull()
});

export interface User {
	id: string,
	username: string,
	profile_image: string,
	isAdmin: boolean | null
}
export type SelectUser = InferSelectModel<typeof user>;

export const session = pgTable("sessions", {
	id: text("id").primaryKey().notNull(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id),
	expiresAt: timestamp("expires_at").notNull(),
});

export interface Session {
	id: string,
	userId: string,
	expiresAt: string | Date
}
export type MySessionsType = InferSelectModel<typeof session>;