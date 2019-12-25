import fs from "fs";
import path from "path";


console.log(process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'schema.graphql'));

export const typeDefs = fs
  .readFileSync(
    process.env.GRAPHQL_SCHEMA || path.join(__dirname, 'schema.graphql')
  )
  .toString('utf-8');
