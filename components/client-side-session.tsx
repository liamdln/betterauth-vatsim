"use client"

import { authClient } from "@/lib/auth-client"

export function ClientSessionInfo() {

    const {data, isPending} = authClient.useSession()

    return (
        <>
            {
                isPending
                ? <p>Loading...</p>
                : <p>{JSON.stringify(data)}</p>
            }
        </>
    )
}