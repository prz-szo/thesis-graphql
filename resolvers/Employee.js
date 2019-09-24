import { Employee } from '../models';


export default {
  employee: async (root, { employeeID }) => {
    const employee = await Employee.findOne({ _id: employeeID }).select('-_header -Photo').exec();
    return employee && ({
      employeeID: employee._id,
      firstName: employee.FirstName,
      lastName: employee.LastName,
      birthDate: employee.BirthDate,
      hireDate: employee.HireDate,
      title: employee.Title,
      titleOfCourtesy: employee.TitleOfCourtesy,
      address: employee.Address,
      city: employee.City,
      region: employee.Region,
      postalCode: employee.PostalCode,
      country: employee.Country,
      homePhone: employee.HomePhone,
      manager: employee.ReportsTo,
      notes: employee.Notes,
      photoPath: employee.PhotoPath,
    });
  },
  employees: async () => {
    const employees = await Employee.find().select('-_header -Photo').exec();

    return employees.map(employee => ({
      employeeID: employee._id,
      firstName: employee.FirstName,
      lastName: employee.LastName,
      birthDate: employee.BirthDate,
      hireDate: employee.HireDate,
      title: employee.Title,
      titleOfCourtesy: employee.TitleOfCourtesy,
      address: employee.Address,
      city: employee.City,
      region: employee.Region,
      postalCode: employee.PostalCode,
      country: employee.Country,
      homePhone: employee.HomePhone,
      manager: employee.ReportsTo,
      notes: employee.Notes,
      photoPath: employee.PhotoPath,
    }));
  }
};
