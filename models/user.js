const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

//add on schema a unique username, password and some other additional tools
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
