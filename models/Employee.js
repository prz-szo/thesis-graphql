import mongoose from 'mongoose';


const Schema = mongoose.Schema;
const SchemaObjectId = Schema.Types.ObjectId;
const ObjectId = mongoose.Types.ObjectId;

const employeeSchema = Schema({
  _id: Number,
  _header: {
    _tenant: String,
    _created: String,
    _createUser: String,
    _createUserId: String
  },
  FirstName: String,
  LastName: String,
  BirthDate: String,
  HireDate: String,
  Title: String,
  TitleOfCourtesy: String,
  Address: String,
  City: String,
  Region: String,
  PostalCode: String,
  Country: String,
  HomePhone: String,
  Extension: String,
  Photo: String,
  ReportsTo: {
    Id: Number,
    DisplayName: String,
  },
  Notes: String,
  PhotoPath: String,
  Territories: [{
    Id: String,
    DisplayName: String,
  }]
});

export default mongoose.model('Employee', employeeSchema);
