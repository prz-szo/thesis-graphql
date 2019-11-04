import { Category } from '../models';


export default {
  Category: async (root, { categoryID }) => {
    const { _id, ...restOfParameters } = await Category.findOne({ _id: categoryID }).select('-picture').lean().exec();

    // TODO: Each category has field products!
    return _id && ({
      ...restOfParameters,
      categoryID: _id,
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
