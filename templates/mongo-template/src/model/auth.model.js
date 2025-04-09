const { Schema, default: mongoose } = require("mongoose");

const authSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      default: "user",
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: [Schema.Types.Mixed],
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;
