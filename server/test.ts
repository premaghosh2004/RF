import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('✅ MongoDB Atlas connected successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ MongoDB Atlas connection failed:', err);
    process.exit(1);
  });
