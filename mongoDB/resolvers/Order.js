import { Order } from '../models';
import { Supplier } from '../models';
import { Category } from '../models';


export default {
  Order: async (root, { productID }) => {
    const { _id, ...restOfProperties } = await Order.findOne({ _id: productID }).lean().exec();
    const supplierForProduct = await Supplier.findOne({ _id: restOfProperties.supplier.id }).lean().exec();
    const categoryForProduct = await Category.findOne({ _id: restOfProperties.category.id }).select('-picture').lean().exec();

    return _id && ({
      ...restOfProperties,
      productID: _id,
      category: {
        ...categoryForProduct,
        categoryID: categoryForProduct._id,
      },
      supplier: {
        ...supplierForProduct,
        supplierID: supplierForProduct._id,
      },
    });
  },
  Orders: async () => {
    const products = await Order.find().lean().exec();
    const suppliers = await Supplier.find().lean().exec();
    const categories = await Category.find().select('-picture').lean().exec();

    return products.map(({ _id, ...restOfProperties }) => {
      const supplierForProduct = suppliers.find(({ _id }) => _id === restOfProperties.supplier.id);
      const categoryForProduct = categories.find(({ _id }) => _id === restOfProperties.category.id);

      return {
      ...restOfProperties,
        productID: _id,
        category: {
          ...categoryForProduct,
          categoryID: categoryForProduct._id,
        },
        supplier: {
          ...supplierForProduct,
          supplierID: supplierForProduct._id,
        },
      };
    });
  }
};
