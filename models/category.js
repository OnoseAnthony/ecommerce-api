const mongoose = require("mongoose");

//SCHEMA
const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "",
  },
  icon: {
    type: String,
    default: "",
  },
  ImageUrl: {
    type: String,
    default: "true",
  },
});

categorySchema.virtual("id").get(function () {
  return this._id.toHexString();
});

categorySchema.set("toJSON", {
  virtuals: true,
});

//MODEL
exports.Category = mongoose.model("Category", categorySchema);
