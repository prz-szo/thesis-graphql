import { Product } from '../models';
import { Supplier } from '../models';
import { Category } from '../models';


export default {
  Product: async (root, { productID }) => {
    const { _id, ...restOfProperties } = await Product.findOne({ _id: productID }).lean().exec();
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
  Products: async () => {
    const products = await Product.find().lean().exec();
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
