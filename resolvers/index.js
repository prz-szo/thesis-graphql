import { default as Employee } from './Employee';

export default {
  Query: {
    employee: (root, { userId }, ctx) => ({
      ...Employee
    }),
  }
};
