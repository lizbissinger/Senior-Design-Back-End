const mongoose = require("mongoose");

const LoadDetailSchema = new mongoose.Schema({
  loadNumber: {
    type: String,
    required: true,
  },
  truckObject: {
    type: String,
    required: true,
  },
  trailerObject: {
    type: String,
    required: true,
  },
  driverObject: {
    type: String,
    required: true,
  },
  pickupTime: {
    type: String,
    required: true,
  },
  deliveryTime: {
    type: String,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  deliveryLocation: {
    type: String,
    required: true,
  },
  documents: [
    {
      data: Buffer,
      contentType: String,
      fileName: String,
    },
  ],
  price: {
    type: Number,
    required: true,
  },
  detentionPrice: {
    type: Number,
    required: false,
  },
  allMiles: {
    type: Number,
    required: false,
  },
  fuelGallons: {
    type: Number,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  brokerInfo: {
    name: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    email: { type: String, required: false },
    company: { type: String, required: false },
  },
  comments: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

module.exports = mongoose.model("LoadDetail", LoadDetailSchema);