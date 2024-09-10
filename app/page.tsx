import { signOut, verifySession } from "./lib/actions";
import Link from "next/link";
import UserList from "./ui/UserList";

export default async function Home() {
  const { user } = await verifySession();

  return (
    <>
      {!user ? (
        <>
          <Link href="/signin">Sign In</Link>
          <br />
          <Link href="/signin/kakao">Kakao Sign In</Link>
        </>
      ) : (
        <>
          {user.isAdmin ? (<UserList />) : (<div>Hello {user.username}!</div>)}
          <form action={signOut}>
            <button>Sign Out</button>
          </form>
        </>
      )}
    </>
  );
}