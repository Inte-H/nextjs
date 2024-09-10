import React from 'react';

interface AuthFormProps {
    action: (formData: FormData) => Promise<{ error: string }>
    action_name: string
}

export default function AuthForm({ action, action_name }: AuthFormProps) {
    return (
        <>
            <form action={action}>
                <label htmlFor="id">ID</label>
                <input name="id" id="id" />
                <br />
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
                <br />
                <button>{action_name}</button>
            </form>
        </>
    );
}
