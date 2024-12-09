require('dotenv').config();
const mongoose = require('mongoose');

const mongoUrl = process.env.AZURE_COSMOS_CONNECTIONSTRING || 'mongodb://celescontainerwebapp-server:Cd8bsmtPGb944jUTWSF6f03i9ZyuoYpKSNd14ZX7rrL5hM9yzcdZF6WidOZABiakigan29ihvSGtACDbgtLJdg==@celescontainerwebapp-server.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@celescontainerwebapp-server@';
const dbName = process.env.DB_NAME || 'test';

console.log('Starting MongoDB setup...');
console.log('MongoDB Connection String:', mongoUrl);
console.log('Database Name:', dbName);

async function setupDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(`${mongoUrl}/${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected to MongoDB at ${mongoUrl}/${dbName}`);

    // Perform any necessary setup here
    console.log('Setting up database...');

    // Example: Create a collection
    const collection = mongoose.connection.collection('example_collection');
    await collection.insertOne({ key: 'value' });
    console.log('Inserted document into example_collection');

    console.log('MongoDB setup completed successfully.');
    process.exit(0); // Exit script
  } catch (error) {
    console.error('MongoDB connection/setup error:', error);
    process.exit(1); // Exit with error
  }
}

setupDatabase();
