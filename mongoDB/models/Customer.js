import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const customerSchema = Schema({
  _id: Number,
  companyName: String,
  contactName: String,
  contactTitle: String,
  address: String,
  city: String,
  region: String,
  postalCode: String,
  country: String,
  phone: String,
  fax: String,
});

export default mongoose.model('Customer', customerSchema);
