import { createAuthClient } from "better-auth/react"

// Generic OAuth providers registered on the server (like VATSIM) are used
// through the standard `signIn.social` client method, so no client plugin
// is needed here.
export const authClient = createAuthClient()
