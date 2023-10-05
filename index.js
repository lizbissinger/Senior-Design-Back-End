require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const loadDetailsRouter = require('./src/routes/loadDetails');
const app = express();

app.use(express.json());
app.use('/loadDetails', loadDetailsRouter);

// .env properties
const PORT = process.env.PORT || 3000;
const db_url = process.env.DB_URL;

// MongoDB cluster connection
mongoose.connect(db_url);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));


app.get("/api", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
