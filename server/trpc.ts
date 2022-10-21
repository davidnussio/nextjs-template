import { initTRPC, TRPCError } from "@trpc/server";

export type ServerContext = {
  session: {
    user?: { id: string; name: string };
  };
};

const t = initTRPC.context<ServerContext>().create();

const isAuthed = t.middleware(({ next, ctx }) => {
  if (!ctx.session.user?.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: {
        user: ctx.session.user,
      },
    },
  });
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);

export const router = t.router;
export const middleware = t.middleware;
