import mongoose from 'mongoose';

export const connectDatabase = async (): Promise<void> => {
  try {
    // This will work with both local MongoDB and Atlas
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set mongoose options for better performance
    mongoose.set('strictQuery', false);
    
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (error) => {
  console.error('MongoDB error:', error);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});
