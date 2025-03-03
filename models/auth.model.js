import mongoose from "mongoose";

const authSchema = mongoose.Schema({
    "email": { type: String, unique: true, required: true },
    "hash": { type: Number, required: true },
    "type": { type: String, enum: ["activate", "password"], default: "activate" },
    "createdAt": { type: Date, default: Date.now},
}, {
    timestamps: true
});

export default mongoose.model('Auth', authSchema);
