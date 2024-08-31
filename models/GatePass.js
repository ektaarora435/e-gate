// gate pass belongs to a user profile and contains details like entry and exit time, purpose, and status

import mongoose from "mongoose";

const GatePassSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  entryTime: {
    type: Date,
    required: false,
  },
  exitTime: {
    type: Date,
    required: false,
  },
  purpose: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const GatePass = mongoose.models?.GatePass || mongoose.model("GatePass", GatePassSchema);

export default GatePass;
