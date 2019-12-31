import dayJS from 'dayjs';
import {
  Customer,
  Order,
} from '../models';
import ProductResolver from './Product';
import EmployeeResolver from './Employee';


function mapOrderDetailsToElements(order) {
  return order.details.map(element => ({
    id: element.product.id,
    quantity: element.quantity,
    unitPrice: element.unitPrice
  }));
}

function simplifyShipAddressNames(orderFromMongo) {
  return {
    address: orderFromMongo.shipAddress,
    city: orderFromMongo.shipCity,
    region: orderFromMongo.shipRegion,
    postalCode: orderFromMongo.shipPostalCode,
    country: orderFromMongo.shipCountry,
  };
}

function composeElementsDataWithOrderData(elementsForProvidedIds, orderElements) {
  return elementsForProvidedIds.map((product, index) => ({
    ...product,
    quantity: orderElements[index].quantity,
    unitPrice: orderElements[index].unitPrice,
  }));
}

const OrderResolver = async (root, { orderID }) => {
  const { _id, ...orderFromMongo } = await Order.findOne({ _id: orderID }).lean().exec();
  const employeeForOrder = await EmployeeResolver.Employee(root, { employeeID: orderFromMongo.employee.id });
  const ownerForOrder = await Customer.findOne({ _id: orderFromMongo.customer.id }).lean().exec();

  const orderElements = mapOrderDetailsToElements(orderFromMongo);
  const elementsForProvidedIds = await Promise.all(
    orderElements.map(el => ProductResolver.Product(root, { productID: el.id }))
  );

  return _id && ({
    ...orderFromMongo,
    orderID: _id,
    employee: employeeForOrder,
    shippedDate: ({ format }) => dayJS(orderFromMongo.shippedDate).format(format),
    orderDate: ({ format }) =>  dayJS(orderFromMongo.orderDate).format(format),
    requiredDate: ({ format }) =>  dayJS(orderFromMongo.requiredDate).format(format),
    owner: {
      ...ownerForOrder,
      customerID: ownerForOrder._id
    },
    elements: composeElementsDataWithOrderData(elementsForProvidedIds, orderElements),
    address: simplifyShipAddressNames(orderFromMongo),
  });
};

export default {
  Order: OrderResolver,
  Orders: async (root, { dateFrom, dateTo }) => {
    const ordersIds = await Order
      .find({ orderDate:
          { $gte: dateFrom, $lte: dateTo }
      })
      .select('_id').lean()
      .exec();

    return ordersIds.map(id => OrderResolver(root, { orderID: id }));
  }
};
