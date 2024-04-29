const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URL;
mongoose
  .connect(url)
  .then((result) => console.log("Connected to mongodb"))
  .catch((error) => console.log(error.message));

const schema = new mongoose.Schema({ name: String, phoneNumber: String });

schema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    console.log(returnedObject, "returned object");
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", schema);

module.exports = Person;
