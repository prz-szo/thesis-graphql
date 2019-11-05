import {
  Customer,
  Employee,
  Order,
} from '../models';
import ProductResolver from './Product';
import EmployeeResolver from './Employee';

export default {
  Order: async (root, { orderID }) => {
    const { _id, ...rest } = await Order.findOne({ _id: orderID }).lean().exec();
    const employeeForOrder = await EmployeeResolver.Employee(root, { employeeID: rest.employee.id });
    const ownerForOrder = await Customer.findOne({ _id: rest.customer.id }).lean().exec();

    const orderElements = rest.details.map(el => ({ id: el.product.id, quantity: el.quantity, unitPrice: el.unitPrice }));
    const elementsForProvidedIds = await Promise.all(orderElements.map(el => ProductResolver.Product(root, { productID: el.id })));

    return _id && ({
      ...rest,
      orderID: _id,
      employee: employeeForOrder,
      owner: {
        ...ownerForOrder,
        customerID: ownerForOrder._id
      },
      elements: elementsForProvidedIds.map((product, index) => ({
        ...product,
        quantity: orderElements[index].quantity,
        unitPrice: orderElements[index].unitPrice,
      })),
      address: {
        address: rest.shipAddress,
        city: rest.shipCity,
        region: rest.shipRegion,
        postalCode: rest.shipPostalCode,
        country: rest.shipCountry,
      },
    });
  }
};
