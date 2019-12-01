import { Employee } from '../models';


export default {
  Employee: async (root, { employeeID }) => {
    const { _id, ...restOfProperties } = await Employee.findOne({ _id: employeeID }).select('-photo').lean().exec();
    const manager = await Employee.findOne({ _id: restOfProperties.reportsTo.id }).select('-photo').lean().exec() || null;

    return _id && ({
      ...restOfProperties,
      employeeID: _id,
      manager: { ...manager, employeeID: restOfProperties.reportsTo.id },
      address: {
        address: restOfProperties.address,
        city: restOfProperties.city,
        region: restOfProperties.region,
        postalCode: restOfProperties.postalCode,
        country: restOfProperties.country,
      },
    });
  },
  Employees: async () => {
    const employees = await Employee.find().select('-photo').lean().exec();

    return employees.map(({ _id, ...restOfProperties }) => {
      const manager = employees.find(employee => employee._id === restOfProperties.reportsTo.id);

      return {
        ...restOfProperties ,
        employeeID: _id,
        manager: manager
          ? { ...manager, employeeID: manager._id }
          : null,
        address: {
          address: restOfProperties.address,
          city: restOfProperties.city,
          region: restOfProperties.region,
          postalCode: restOfProperties.postalCode,
          country: restOfProperties.country,
        },
      };
    });
  }
};
