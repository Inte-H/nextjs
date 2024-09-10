import { signUp } from "../lib/actions";
import AuthForm from '@/app/ui/AuthForm';

export default async function Page() {
    return (
        <>
            <h1>Create an account</h1>
            <AuthForm action={signUp}></AuthForm>
        </>
    );
}
