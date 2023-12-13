import "reflect-metadata";
import path from "node:path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { expressMiddleware } from "@apollo/server/express4";
import { buildSchema } from "type-graphql";
import { RecipeResolver } from "./graphQl/recipe/recipe.resolver";
import express from "express";
import cors from "cors";
import config from "./config/config";

console.log(config.PORT);

async function bootstrap() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Build TypeGraphQL executable schema
  const schema = await buildSchema({
    // Array of resolvers
    resolvers: [RecipeResolver],
    // Create 'schema.graphql' file with schema definition in current directory
    emitSchemaFile: path.resolve(__dirname, "schema.graphql"),
  });

  // Create GraphQL server
  const server = new ApolloServer({ schema });

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(config.PORT || 4040, () => {
    console.log(
      `Server Running on http://localhost:${config.PORT || 4040}/graphql 🚥`
    );
  });
}

bootstrap().catch(console.error);
