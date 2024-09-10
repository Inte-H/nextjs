import Link from "next/link";
import { signIn } from "../lib/actions";
import AuthForm from '@/app/ui/AuthForm';

export default async function Page() {
    return (
        <>
            <h1>Sign In</h1>
            <AuthForm action={signIn} action_name="Sign In"></AuthForm>
            <Link href='/signup'>Sign Up</Link>
        </>
    );
}
