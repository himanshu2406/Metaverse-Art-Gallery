// Import MongoClient
const { MongoClient } = require('mongodb');

// Create connection string
const uri = 'mongodb://localhost:27017';

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // List the databases in the cluster
    const databases = await client.db().admin().listDatabases();

    // Print the database names
    console.log('Databases:');
    databases.databases.forEach(db => console.log(` - ${db.name}`));
  } finally {
    // Close the connection
    await client.close();
  }
}

run().catch(console.error);