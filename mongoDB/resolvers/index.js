import { default as EmployeeResolver } from './Employee';
import { default as CategoryResolver } from './Category';


export default {
  Query: {
    simpleQuery: (root, args, context, info) => 'Jestem prostym Query',
    ...EmployeeResolver,
    ...CategoryResolver,
  }
};
