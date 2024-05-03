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

app.get("/info", (req, res, next) => {
  Person.find({})
    .then((person) => {
      const timestamp = new Date();
      return res.send(
        `<p>Phonebook has info for ${person.length} people</p>
  <p>${timestamp}</p>
  `
      );
    })
    .catch((error) => next(error));
});

app.get("/api/persons", (req, res, next) => {
  Person.find({})
    .then((person) => res.json(person))
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => res.json(person))
    .catch((error) => next(error));
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

app.put("/api/persons/:id", (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;
  const { name, phoneNumber } = req.body;

  const person = {
    name,
    phoneNumber,
  };

  Person.findByIdAndUpdate(id, person, { new: true }).then((updatedPerson) => {
    console.log(updatedPerson);
    res.json(updatedPerson);
  });
});

app.delete("/api/persons/:id", (req, res) => {
  console.log("here");
  Person.findByIdAndDelete(req.params.id)
    .then((deletedPerson) => {
      if (deletedPerson) {
        res.status(204).json(deletedPerson);
      } else {
        res.status(400).json(`Person does not exist in phonebook`);
      }
      console.log(deletedPerson, "deleted person");
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

// handler of requests with unknown endpoint
app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  }

  res.status(400).send({ error: "An error has occured." });

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
