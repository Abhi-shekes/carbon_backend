import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Credential",
      required: true,
    },
    productName: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    facilityAddress: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "collected", "failed", "declined"],
      default: "pending",
    },
    points: { type: Number, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
