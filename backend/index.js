require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.json());

app.use(morgan("tiny"));

app.use(cors());

app.use(express.static("dist"));

app.use(
  morgan(function (tokens, req, res) {
    if (tokens.method(req, res) === "POST") {
      return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, "content-length"),
        "-",
        tokens["response-time"](req, res),
        "ms",
        JSON.stringify(req.body),
      ].join(" ");
    }
  })
);

// let persons = [
//   {
//     id: 1,
//     name: "Arto Hellas",
//     number: "040-123456",
//   },
//   {
//     id: 2,
//     name: "Ada Lovelace",
//     number: "39-44-5323523",
//   },
//   {
//     id: 3,
//     name: "Dan Abramov",
//     number: "12-43-234345",
//   },
//   {
//     id: 4,
//     name: "Mary Poppendieck",
//     number: "39-23-6423122",
//   },
// ];

// const generateId = (min, max) => {
//   return Math.floor(Math.random() * (max - min) + min);
// };

// const checkNameExists = (name, persons) => {
//   return persons.some((person) => person.name === name);
// };

app.get("/info", (req, res) => {
  const timestamp = new Date();
  const infoAmount = persons.length;

  res.send(`<p>Phonebook has info for ${infoAmount} people</p>
  <p>${timestamp}</p>
  `);
});

app.get("/api/persons", (req, res) => {
  Person.find({}).then((person) => res.json(person));
});

app.get("/api/persons/:id", (req, res) => {
  Person.findById(req.params.id).then((person) => res.json(person));
});

app.post("/api/persons", (req, res) => {
  const { name, phoneNumber } = req.body;

  if (!name) {
    res.status(400).json({ error: "missing name" });
  } else if (!phoneNumber) {
    res.status(400).json({ error: "missing number" });
  } else {
    const person = new Person({
      name,
      phoneNumber,
    });

    person.save().then((savedPerson) => res.json(savedPerson));
  }
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res
      .status(404)
      .json({ error: `Person with id '${id}' does not exist` });
  }

  persons = persons.filter((person) => person.id !== id);

  res.status(204).json({ person });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
