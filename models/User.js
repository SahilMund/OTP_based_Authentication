const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    failedAttempts: {
      type: Number,
      default: 0,
    },
    lockedAt: {
      type: Date,
    },
   
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
