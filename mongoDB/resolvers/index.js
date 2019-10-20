import { default as EmployeeResolver } from './Employee';


export default {
  Query: {
    ...EmployeeResolver
  }
};
