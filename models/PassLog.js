import mongoose from "mongoose";

const PassLogSchema = new mongoose.Schema({
  by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  pass: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GatePass",
  },
  time: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
}, {
  timestamps: true
});

const PassLog = mongoose.models?.PassLog || mongoose.model("PassLog", PassLogSchema);

export default PassLog;
