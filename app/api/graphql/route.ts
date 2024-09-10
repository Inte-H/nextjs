import { buildSchema } from "drizzle-graphql";
import { createYoga } from "graphql-yoga";

import { db } from "@/db/db";

const { schema } = buildSchema(db);
const { handleRequest } = createYoga({
    schema: schema,
    graphqlEndpoint: "/api/graphql"
});

export { handleRequest as GET, handleRequest as POST }