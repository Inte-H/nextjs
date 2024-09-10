import { User } from "@/db/schema";
import { fetchUsers } from "../api/route";

export default async function UserList() {
    const users = await fetchUsers();

    return (
        <>
            <div>
                <h1>회원 목록</h1>
                <ul>
                    {users.map((user: User) => (
                        <li key={user.id}>
                            <strong>ID:</strong> {user.id}, <strong>Username:</strong> {user.username}
                            {user.profile_image && <img src={user.profile_image} alt={user.username} />}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}