import fs from "fs";
import path from "path";


export const typeDefs = fs
  .readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'schemas', 'schema.graphql')
  )
  .toString('utf-8');
