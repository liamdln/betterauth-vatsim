import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// The auth instance is created lazily, so the handler resolves it on the
// first request rather than at module-load time.
const handler = async (request: Request) => (await auth()).handler(request);

export const { GET, POST } = toNextJsHandler(handler);
