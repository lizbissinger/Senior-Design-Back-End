const mongoose = require("mongoose");

const LoadDetailSchema = new mongoose.Schema({
  loadNumber: {
    type: String,
    required: true,
  },
  truckObject: {
    type: String,
    required: false,
  },
  trailerObject: {
    type: String,
    required: false,
  },
  driverObject: {
    type: String,
    required: false,
  },
  pickupTime: {
    type: String,
    required: false,
  },
  deliveryTime: {
    type: String,
    required: false,
  },
  pickupLocation: {
    type: String,
    required: false,
  },
  deliveryLocation: {
    type: String,
    required: false,
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
    required: false,
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
    required: false,
  },
  updatedAt: {
    type: Date,
    required: false,
    default: Date.now,
  },
});

module.exports = mongoose.model("LoadDetail", LoadDetailSchema);