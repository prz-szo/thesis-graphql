import mongoose from 'mongoose';


const categorySchema = mongoose.Schema({
  _id: Number,
  categoryName: String,
  description: String,
  picture: String
});


export default mongoose.model('Category', categorySchema);
