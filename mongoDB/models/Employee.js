import mongoose from 'mongoose';


const Schema = mongoose.Schema;

const employeeSchema = Schema({
  _id: Number,
  firstName: String,
  lastName: String,
  birthDate: String,
  hireDate: String,
  title: String,
  titleOfCourtesy: String,
  address: String,
  city: String,
  region: String,
  postalCode: String,
  country: String,
  homePhone: String,
  extension: String,
  photo: String,
  reportsTo: {
    id: Number,
    displayName: String,
  },
  notes: String,
  photoPath: String,
  territories: [{
    id: String,
    displayName: String,
  }]
});

export default mongoose.model('Employee', employeeSchema);
