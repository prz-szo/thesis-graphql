import { Employee } from 'mongoDB/models';


export default {
  Employee: async (root, { employeeID }) => {
    const { _id, ...restOfParameters } = await Employee.findOne({ _id: employeeID }).select('-photo').lean().exec();
    return _id && ({
      employeeID: _id,
      ...restOfParameters
    });
  },
  Employees: async () => {
    const employees = await Employee.find().select('-photo').lean().exec();

    return employees.map(({ _id, ...restOfProperties }) => ({
      employeeID: _id,
      ...restOfProperties
    }));
  }
};
