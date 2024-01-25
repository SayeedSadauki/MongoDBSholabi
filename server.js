// server.js
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/simple-node-mongo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define a schema for your form data
const formDataSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Create a model based on the schema
const FormData = mongoose.model('FormData', formDataSchema);

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up your HTML form
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Handle form submissions
app.post('/submit', async (req, res) => {
  const formData = req.body;

  // Create a new document using the FormData model
  const newFormData = new FormData(formData);

  try {
    // Save the document to MongoDB
    await newFormData.save();
    console.log('Form data saved to MongoDB');
    res.send('Form submitted successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

