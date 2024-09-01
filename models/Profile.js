import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Email is invalid",
    ],
  },
  phone: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.models?.Profile || mongoose.model("Profile", ProfileSchema);

export default Profile;
