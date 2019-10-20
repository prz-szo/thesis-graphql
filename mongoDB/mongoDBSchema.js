import fs from "fs";
import path from "path";


export const typeDefs = fs
  .readFileSync(
    process.env.GRAPHQL_MONGO_SCHEMA || path.join(__dirname, 'schemas', 'schemaMongoDB.graphql')
  )
  .toString('utf-8');
