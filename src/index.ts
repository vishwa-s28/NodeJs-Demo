import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/userService";


async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        // @ts-ignore
        const token = req.headers["token"];

        try {
          const user = UserService.decodeJWTToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );
    //   app.use(
  //     "/graphql",
  //     expressMiddleware(gqlServer, {
  //       context: async ({ req }) => {
  //         return {
  //           user: req.headers.user || null,
  //         };
  //       },
  //     })
  //   );

  app.listen(PORT, () => {
    console.log(`Server started as PORT:${PORT}`);
  });
}

init();
