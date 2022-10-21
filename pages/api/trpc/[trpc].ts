import * as trpcNext from "@trpc/server/adapters/next";
import { z } from "zod";
import {
  protectedProcedure,
  publicProcedure,
  router,
  ServerContext,
} from "~/server/trpc";

const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Mary Jane",
    email: "mary.jane@example.com",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

const users = router({
  list: publicProcedure.query(() => {
    return usersData;
  }),
});

const appRouter = router({
  users,
  greeting: publicProcedure
    // This is the input schema of your procedure
    // 💡 Tip: Try changing this and see type errors on the client straight away
    .input(
      z.object({
        name: z.string().nullish(),
      })
    )
    .query(({ input, ctx }) => {
      // This is what you're returning to your client
      console.log(ctx.session.user);
      return {
        text:
          `hello ${input?.name ?? "world"} ${(Math.random() * 100) | 0}` +
          ` ${ctx.session.user?.name ?? "no user"}`,
      };

      // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
    }),

  // 💡 Tip: Try adding a new procedure here and see if you can use it in the client!
  // getUser: t.procedure.query(() => {
  //   return { id: '1', name: 'bob' };
  // }),
  admin: protectedProcedure.query(() => {
    return { admin: true };
  }),
});

// export only the type definition of the API
// None of the actual implementation is exposed to the client
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: (): ServerContext => ({
    session: {
      // user: {
      //   id: "1",
      //   name: "bob",
      // },
    },
  }),
});
