const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true
    },
    author: {
      type: String,
      default: "BlogSpace User"
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    default: null
    },
    category: {
      type: String,
      default: "General"
    },
    excerpt: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);