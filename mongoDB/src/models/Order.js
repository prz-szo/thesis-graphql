import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const orderSchema = Schema({
  _id: Number,
  customer: {
    id: Number,
    displayName: String,
  },
  employee: {
    id: Number,
    displayName: String,
  },
  orderDate: Date,
  requiredDate: Date,
  shippedDate: Date,
  shipVia: {
    id: Number,
    displayName: String,
  },
  freight: Number,
  shipName: String,
  shipAddress: String,
  shipCity: String,
  shipRegion: String,
  shipPostalCode: String,
  shipCountry: String,
  details: [{
    product: {
      id: Number,
      displayName: String,
    },
    unitPrice: Number,
    quantity: Number,
    discount: Number,
  }]
});

export default mongoose.model('Order', orderSchema);
