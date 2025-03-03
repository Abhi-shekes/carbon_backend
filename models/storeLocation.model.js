import mongoose from "mongoose";

const storeLocationSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: Number, required: true },
    address: { type: String, required: true },
    installedCapacityMTA: { type: Number, required: true },
    contact: {
      phone_no: { type: String, required: true },
      website: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export default mongoose.model("StoreLocation", storeLocationSchema);
