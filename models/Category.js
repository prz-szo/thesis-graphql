import mongoose from 'mongoose';


const categorySchema = mongoose.Schema({
  _id: Number,
  _header: {
    _tenant: String,
    _created: String,
    _createUser: String,
    _createUserId: String
  },
  CategoryName: String,
  Description: String,
  Picture: String
});


export default mongoose.model('Category', categorySchema);
