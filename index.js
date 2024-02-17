require('dotenv').config();
const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');
const loadDetailsRouter = require('./src/routes/loadDetails');
const driverDetailsRouter = require('./src/routes/driverDetails');
const trailerDetailsRouter = require('./src/routes/trailerDetails');
const truckDetailsRouter = require('./src/routes/truckDetails');
const reportsRouter = require('./src/routes/reports');
const repairDetailsRouter = require('./src/routes/repairDetails');
const payrollDetailsRouter = require('./src/routes/payrollDetails');
const app = express();

// Mount middleware and routes
app.use(express.json());
app.use(cors());
app.use('/loadDetails', loadDetailsRouter);
app.use('/driverDetails', driverDetailsRouter);
app.use('/trailerDetails', trailerDetailsRouter);
app.use('/truckDetails', truckDetailsRouter);
app.use('/reports', reportsRouter);
app.use('/repairs', repairDetailsRouter);
app.use('/payroll', payrollDetailsRouter); //try payrolls

// .env properties
const PORT = process.env.PORT || 3000;
const db_url = process.env.DB_URL;

// MongoDB cluster connection
mongoose.connect(db_url);
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to MongoDB'));

// Create new instance
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
