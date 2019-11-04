import {
  Category,
  Product, Supplier,
} from '../models';


export default {
  Category: async (root, { categoryID }) => {
    const { _id, ...rest } = await Category.findOne({ _id: categoryID }).select('-picture').lean().exec();
    const productsWithTheCategory = await Product.find({ category: { id: _id, displayName: rest.categoryName } }).lean().exec();
    const suppliers = await Supplier.find().lean().exec();

    return _id && ({
      ...rest,
      categoryID: _id,
      products: productsWithTheCategory.map(product => {
        const supplierForProduct = suppliers.find(({ _id }) => _id === product.supplier.id);
        return {
          ...product,
          productID: product._id,
          category: {
            ...rest,
            categoryID: _id,
          },
          supplier: {
            ...supplierForProduct,
            supplierID: supplierForProduct._id,
          },
        }
      }),
    });
  },
  Categories: async () => {
    const categories = await Category.find().select('-picture').lean().exec();

    // TODO: Each category has field products!
    return categories.map(({ _id, ...restOfProperties }) => ({
      ...restOfProperties,
      categoryID: _id,
    }));
  }
};
