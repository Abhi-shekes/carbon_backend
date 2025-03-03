import mongoose from "mongoose";

const credentialSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, unique: true, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    totalPoints: { type: Number, default: 0 },
    active: { type: Boolean, default: "false" },
    type: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Credential", credentialSchema);
