import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { ApolloServer } from 'apollo-server-express';
import { v1 as neo4j } from 'neo4j-driver';
import { makeAugmentedSchema } from 'neo4j-graphql-js';

import { typeDefs as typeDefsNeo4j } from './graphqlNeo4jSchema';


console.log(dotenv.config());
const {
  NEO4J_URI,
  NEO4J_USER,
  NEO4J_PASSWORD,

  GRAPHQL_NEO4j_LISTEN_PORT,
  GRAPHQL_NEO4J_LISTEN_PATH,

  API_HOST
} = process.env;

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect with Neo4j
const schemaForNeo4jCompliance = makeAugmentedSchema({
  typeDefs: typeDefsNeo4j
});

const driver = neo4j.driver(
  NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(
    NEO4J_USER || "neo4j",
    NEO4J_PASSWORD || "neo4j"
  )
);

const serverWithNeo4j = new ApolloServer({
  context: { driver },
  schema: schemaForNeo4jCompliance
});
serverWithNeo4j.applyMiddleware({
  app,
  path: GRAPHQL_NEO4J_LISTEN_PATH
});

app.listen( { port: GRAPHQL_NEO4j_LISTEN_PORT, host: API_HOST }, () =>
  console.log(`🚀 Server ready at http://${API_HOST}:${GRAPHQL_NEO4j_LISTEN_PORT}${serverWithNeo4j.graphqlPath}`)
);
