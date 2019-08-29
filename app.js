import express from 'express';
import bodyParser from 'body-parser';
import { ApolloServer } from "apollo-server-express";
import { v1 as neo4j } from "neo4j-driver";
import { makeAugmentedSchema } from "neo4j-graphql-js";
import dotenv from "dotenv";

import { typeDefs } from './graphql-schema';


dotenv.config();
const {
  NEO4J_URI,
  NEO4J_USER,
  NEO4J_PASSWORD,
  GRAPHQL_LISTEN_PORT,
  GRAPHQL_LISTEN_PATH,
  API_HOST
} = process.env;


const schema = makeAugmentedSchema({
  typeDefs
});

const driver = neo4j.driver(
  NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    NEO4J_USER || "neo4j",
    NEO4J_PASSWORD || "neo4j"
  )
);

const app = express();
app.use(bodyParser.json());
const server = new ApolloServer({
  context: { driver },
  schema
});

server.applyMiddleware({
  app,
  path: GRAPHQL_LISTEN_PATH
});

app.listen( { port: GRAPHQL_LISTEN_PORT, host: API_HOST }, () =>
  console.log(`🚀 Server ready at http://${API_HOST}:${GRAPHQL_LISTEN_PORT}${server.graphqlPath}`)
);
