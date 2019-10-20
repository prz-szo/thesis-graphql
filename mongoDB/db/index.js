import mongoose from 'mongoose';


const connectWithMongo = async () => {
  try {
    const url = process.env.MONGO_URI || 'mongodb://localhost:27017/Northwind';
    mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true  });
    mongoose.connection.once('open', () => console.log(`💾 Connected to mongo at ${url}`));
  } catch (error) {
    console.error(error);
    process.exit();
  }
};

export default connectWithMongo;
