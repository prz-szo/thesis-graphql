import mongoose from 'mongoose';


const categorySchema = mongoose.Schema({
  _id: Number,
  CategoryName: String,
  Description: String,
  Picture: String
});


export default mongoose.model('Category', categorySchema);
