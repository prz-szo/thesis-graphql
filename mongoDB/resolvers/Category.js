import { Category } from '../models';


export default {
  Category: async (root, { categoryID }) => {
    const { _id, ...restOfParameters } = await Category.findOne({ _id: categoryID }).select('-picture').lean().exec();
    return _id && ({
      categoryID: _id,
      ...restOfParameters,
    });
  },
  Categories: async () => {
    const categories = await Category.find().select('-picture').lean().exec();

    return categories.map(({ _id, ...restOfProperties }) => ({
      categoryID: _id,
      ...restOfProperties,
    }));
  }
};
