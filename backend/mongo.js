const mongoose = require("mongoose");

if (process.argv.length === 4) {
  console.error("Please provide a phone number");
  process.exit(1);
}

if (process.argv.length < 3) {
  console.error("Please provide a password");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const phoneNumber = process.argv[4];

const url = `mongodb+srv://fullstackopen:${password}@cluster0.ip9ybtg.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.connect(url);

mongoose.set("strictQuery", false);

const schema = new mongoose.Schema({ name: String, phoneNumber: String });
const Person = mongoose.model("Person", schema);

if (process.argv.length === 3) {
  Person.find({}).then((result) => {
    console.log("phonebook:");
    result.forEach((person) => console.log(person));
    mongoose.connection.close();
  });
} else {
  const person = new Person({ name, phoneNumber });

  person.save().then((result) => {
    console.log(`added ${name} number ${phoneNumber} to phonebook`);
    mongoose.connection.close();
  });
}
