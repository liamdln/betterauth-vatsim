import { AuthButtons } from "@/components/auth-buttons";
import { ClientSessionInfo } from "@/components/client-side-session";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {

    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <div className="">
            <AuthButtons />
            <div className="flex border border-slate-900 flex gap-3">
                <div className="max-w-[calc(100svw/2)] overflow-x-auto">
                    <p className="font-bold">Client Session</p>
                    <ClientSessionInfo />
                </div>
                <div className="border-s border-slate-900"></div>
                <div className="max-w-[calc(100svw/2)] overflow-x-auto">
                    <p className="font-bold">Server Session</p>
                    {JSON.stringify(session)}
                </div>
            </div>
        </div>
    );
}
