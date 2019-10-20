import { default as EmployeeResolver } from 'mongoDB/resolvers/Employee';


export default {
  Query: {
    ...EmployeeResolver
  }
};
