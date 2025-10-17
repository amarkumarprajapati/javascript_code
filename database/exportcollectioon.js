const { MongoClient } = require('mongodb');
const fs = require('fs').promises; // For file operations

async function exportCollection() {
  // MongoDB connection details
  const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB URI
  const dbName = 'mydb'; // Replace with your database name
  const collectionName = 'mycollection'; // Replace with your collection name
  const outputFile = 'mycollection.json'; // Output file name

  // Create a new MongoClient
  const client = new MongoClient(uri);

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('Connected to MongoDB');

    // Select database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all documents
    const documents = await collection.find({}).toArray();

    // Convert to JSON and save to file
    await fs.writeFile(outputFile, JSON.stringify(documents, null, 2));
    console.log(`Collection exported successfully to ${outputFile}`);
  } catch (error) {
    console.error('Error exporting collection:', error);
  } finally {
    // Close the connection
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the function
exportCollection();