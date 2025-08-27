"use client"

import { authClient } from "@/lib/auth-client"

export function AuthButtons() {

    const {data, isPending} = authClient.useSession()

    const login = async () => {
        const {data, error} = await authClient.signIn.oauth2({providerId: "vatsim"})
        console.log(JSON.stringify(data))
        if (error) console.error(error)
    }

    const logout = async () => {
        await authClient.signOut()
    }

    return (
        <div className="">
            {
                data?.session
                ? <button className="px-3 py-1.5 bg-green-400" disabled={isPending} onClick={logout}>Logout</button>
                : <button className="px-3 py-1.5 bg-green-400" disabled={isPending} onClick={login}>Login</button>
            }
        </div>
    )
}