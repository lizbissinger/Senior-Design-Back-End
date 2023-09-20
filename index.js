require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const app = express();

// .env properties
const PORT = process.env.PORT || 3000;
const db_url = process.env.DB_URL;

// MongoDB cluster connection
mongoose.connect(db_url);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

app.use(express.json());

const testRouter = require('./src/routes/test');
app.use('/test', testRouter);

app.get("/api", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});