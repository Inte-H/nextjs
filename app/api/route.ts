import { User } from "@/db/schema";

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