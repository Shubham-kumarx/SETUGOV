import mongoose from 'mongoose';

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
    return true;
  } catch (error) {
    if (process.env.ALLOW_MEMORY_FALLBACK !== 'false') {
      console.warn('MongoDB unavailable. Running with in-memory demo data. Set ALLOW_MEMORY_FALLBACK=false to fail fast.');
      return false;
    }
    throw error;
  }
}
