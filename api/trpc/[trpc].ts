import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import superjson from "superjson";
import { appRouter } from "../../server/routers";

function toRecord(headers: Headers) {
  const out: Record<string, string> = {};
  headers.forEach((v, k) => {
    out[k] = v;
  });
  return out;
}

export default function handler(req: Request) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    transformer: superjson,
    createContext: async () => {
      // Minimal context shape for routers that read origin/cookies.
      return {
        req: { headers: toRecord(req.headers) } as any,
        res: {
          clearCookie: () => {},
        } as any,
        user: null,
      };
    },
  });
}

