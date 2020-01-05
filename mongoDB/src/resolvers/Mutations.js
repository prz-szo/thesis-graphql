import dayJS from 'dayjs';
import {
  Order,
  Employee,
  Customer,
  Product,
} from '../models';
import OrderResolver from './Order'

export const CreateNewOrderMutation = async (root, { order }) => {
  const lastOrder = (await Order.find().skip(await Order.count() - 1).lean().exec())[0];

  const employee = await Employee.findOne({ _id: order.employeeID }).select('firstName lastName').exec();
  const customer = await Customer.findOne({ _id: order.ownerID }).select('companyName').exec();
  const products = await Product.find({ _id: { $in: order.elements.map(el => el.productID) } }).select('productName unitPrice');

  const details = order.elements.map((element, index) => {
    return {
      product: {
        id: element.productID,
        displayName: products[index].productName
      },
      unitPrice: products[index].unitPrice,
      quantity: element.quantity
    };
  });

  const newOrder = {
    _id: lastOrder._id + 1,
    customer: { id: order.ownerID, displayName: `${customer.companyName}` },
    employee: { id: order.employeeID, displayName: `${employee.firstName} ${employee.lastName}` },
    shipName: `${customer.companyName}`,
    freight: order.freight,
    orderDate: dayJS(order.orderDate),
    requiredDate: dayJS(order.requiredDate),
    shippedDate: dayJS(order.shippedDate),
    shipAddress: order.address.address,
    shipCity: order.address.city,
    shipRegion: order.address.region,
    shipPostalCode: order.address.postalCode,
    shipCountry: order.address.country,
    details,
  };

  await Order.create(newOrder);

  return await OrderResolver.Order(null, { orderID: lastOrder._id + 1 });
};


export const CreateCustomerWithFirstOrderMutation = async (root, { customer }) => {
  const newCustomer = {
    _id: customer.companyName.replace(' ', '').substring(0,5).toUpperCase(),
    companyName: customer.companyName,
    contactName: customer.contactName,
    contactTitle: customer.contactTitle,
    address: customer.address.address,
    city: customer.address.city,
    region: customer.address.region,
    postalCode: customer.address.postalCodde,
    country: customer.address.country,
    phone: customer.phone,
    fax: customer.fax,
  };

  await Customer.create(newCustomer);

  return await CreateNewOrderMutation(root, {
    order: {...customer.initialOrder, ownerID: newCustomer._id }
  });
};
