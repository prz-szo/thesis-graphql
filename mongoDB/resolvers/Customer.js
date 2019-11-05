import { Customer, Order } from '../models';
import OrderResolver from './Order';


export default {
  Customer: async (root, { customerID }) => {
    const { _id, ...rest } = await Customer.findOne({ _id: customerID }).lean().exec();
    const customerOrdersIds = await Order.find({ customer: { id: _id, displayName: rest.companyName }}).select('_id').lean().exec();

    return _id && ({
      ...rest,
      customerID: _id,
      address: {
        address: rest.address,
        city: rest.city,
        region: rest.region,
        postalCode: rest.postalCode,
        country: rest.country,
      },
      orders: customerOrdersIds.map(orderId => OrderResolver.Order(root, { orderID: orderId }))
    });
  },
  Customers: async () => {
    const suppliers = await Customer.find().lean().exec();

    return suppliers.map(({ _id, ...rest }) => ({
      ...rest,
      customerID: _id,
      address: {
        address: rest.address,
        city: rest.city,
        region: rest.region,
        postalCode: rest.postalCode,
        country: rest.country,
      },
    }));
  }
};
