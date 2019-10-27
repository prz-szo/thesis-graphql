import { default as EmployeeResolver } from './Employee';
import { default as CategoryResolver } from './Category';
import { GraphQLID, GraphQLEnumType } from 'graphql';

const EnumType = new GraphQLEnumType({
  name: 'EnumType',
  values: {
    FIRST_TYPE: { value: 0 },
    SECOND_TYPE: { value: 1 },
    THIRD_TYPE: { value: 2 }
  }
});

export default {
  Query: {
    simpleQuery: (root, args, context, info) => 'I\'m simple Query',
    exampleQueryOfType: () => ({
      intField: () => 42,
      floatField: () => 3.14,
      stringButWithoutFunction: 'stringButWithoutFunction',
      stringField: () => 'Meaning of life',
      booleanField: () => new Promise((resolve) => setTimeout(() => resolve(true), 300)),
      IDField: () => GraphQLID.parseValue(123),
      enumType: () => EnumType.getValue('SECOND_TYPE').name
    }),
    ...EmployeeResolver,
    ...CategoryResolver,
  }
};

