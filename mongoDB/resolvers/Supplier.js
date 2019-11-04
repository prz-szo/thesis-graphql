import { Supplier } from '../models';


export default {
  Supplier: async (root, { supplierID }) => {
    const { _id, ...restOfProperties } = await Supplier.findOne({ _id: supplierID }).lean().exec();
    return _id && ({
      ...restOfProperties,
      supplierID: _id,
      address: {
        address: restOfProperties.address,
        city: restOfProperties.city,
        region: restOfProperties.region,
        postalCode: restOfProperties.postalCode,
        country: restOfProperties.country,
      },
    });
  },
  Suppliers: async () => {
    const suppliers = await Supplier.find().lean().exec();

    return suppliers.map(({ _id, ...restOfProperties }) => ({
      ...restOfProperties,
      supplierID: _id,
      address: {
        address: restOfProperties.address,
        city: restOfProperties.city,
        region: restOfProperties.region,
        postalCode: restOfProperties.postalCode,
        country: restOfProperties.country,
      },
    }));
  }
};
