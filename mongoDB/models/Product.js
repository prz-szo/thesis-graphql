import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
  _id: Number,
  productName: String,
  quantityPerUnit: String,
  unitPrice: Number,
  unitsInStock: Number,
  unitsOnOrder: Number,
  category: {
    id: Number,
    displayName: String
  },
  supplier: {
    id: Number,
    displayName: String
  }
});


export default mongoose.model('Product', productSchema);
