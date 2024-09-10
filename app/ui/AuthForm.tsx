import React from 'react';

interface AuthFormProps {
    action: (formData: FormData) => Promise<{ error: string }>
}

export default function AuthForm({ action }: AuthFormProps) {
    return (
        <>
            <form action={action}>
                <label htmlFor="id">ID</label>
                <input name="id" id="id" />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <br />
                <button>{action.name}</button>
            </form>
        </>
    );
}
