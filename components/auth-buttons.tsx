"use client"

import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export function AuthButtons() {

    const router = useRouter()
    const { data: sessionData, isPending } = authClient.useSession()

    const login = async () => {
        const { data: signInData, error } = await authClient.signIn.social({ provider: "vatsim" })
        if (error) {
            console.error(error)
            return
        }
        // The client normally follows the returned URL automatically; make
        // sure we always land on VATSIM's authorization page.
        if (signInData?.url) window.location.href = signInData.url
    }

    const logout = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => router.refresh()
            }
        })
    }

    return (
        <div className="">
            {
                sessionData?.session
                ? <button className="px-3 py-1.5 bg-green-400" disabled={isPending} onClick={logout}>Logout</button>
                : <button className="px-3 py-1.5 bg-green-400" disabled={isPending} onClick={login}>Login</button>
            }
        </div>
    )
}
