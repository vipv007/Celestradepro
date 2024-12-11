require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl ='mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = 'test';

console.log('Starting MongoDB setup...');
console.log('MongoDB Connection String:', mongoUrl);
console.log('Database Name:', dbName);

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    const startTime = Date.now();
    await mongoose.connect(`${mongoUrl}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const connectionTime = Date.now() - startTime;
    console.log(`Connected to MongoDB at ${mongoUrl}/${dbName} in ${connectionTime}ms`);
    process.exit(0); // Exit script successfully
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit with error
  }
}

setupDatabase();
