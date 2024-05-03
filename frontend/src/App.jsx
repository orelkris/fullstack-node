import { useState, useEffect } from "react";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Notification from "./components/Notification";
import { NotificationType } from "./components/Notification";
import actions from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState(null);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterInput, setFilterInput] = useState("");
  const [notification, setNotification] = useState({
    type: null,
    message: null,
  });

  const reset = () => {
    setNewName("");
    setNewNumber("");
  };

  const nameValidation = (name) => {
    const nameFound = persons.find((person) => person.name === name);
    if (nameFound) {
      throw new Error();
    }
  };

  const confirmPersonUpdate = (name) => {
    return confirm(
      `${name} is already added to phonebook. Replace the old number with a new one?`
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      nameValidation(newName);
      actions
        .createPerson({ name: newName, phoneNumber: newNumber })
        .then((newPerson) => {
          setPersons([...persons, newPerson]);
          handleNotification(`Added ${newName} to phonebook.`);
        })
        .catch((error) => {
          handleNotification(
            `Error: ${error.response.data.error}`,
            NotificationType.FAIL
          );
        });
      reset();
    } catch (e) {
      const isConfirmed = confirmPersonUpdate(newName);
      const personId = persons.find((person) => person.name === newName)?.id;

      if (isConfirmed) {
        actions
          .updatePerson(personId, {
            name: newName,
            phoneNumber: newNumber,
          })
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id === personId ? updatedPerson : person
              )
            );
            handleNotification(`Updated ${newName}'s number.`);
          })
          .catch((error) => {
            handleNotification(
              `${error?.response?.data?.error}`,
              NotificationType.FAIL
            );
          });
      }
      reset();
    }
  };

  const handleNotification = (message, type = NotificationType.SUCCESS) => {
    setNotification({
      type,
      message,
    });

    setTimeout(() => {
      setNotification({ type: null, message: null });
    }, 3000);
  };

  const handleNameChange = (event) => {
    const name = event.target.value;
    setNewName(name);
  };

  const handleNumberChange = (event) => {
    const phoneNumber = event.target.value;
    setNewNumber(phoneNumber);
  };

  const handleFilterInput = (event) => {
    const filterInput = event.target.value;
    setFilterInput(filterInput);
  };

  const handleDeletion = (id) => {
    const person = persons.find((person) => person.id === id);
    const isConfirmed = confirm(`Delete ${person.name}?`);

    if (isConfirmed) {
      actions.deletePerson(id).then((deletedPerson) => {
        setPersons(persons.filter((person) => person.id !== deletedPerson.id));
      });
    }
  };

  const dataHandler = () => {
    actions.getPersons().then((persons) => setPersons(persons));
  };

  useEffect(dataHandler, []);

  if (!persons) return null;

  const filterPersons = persons.filter((person) =>
    person?.name?.toLowerCase().includes(filterInput.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      {notification.type && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <Filter handleFilterInput={handleFilterInput} filterInput={filterInput} />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h2>Numbers</h2>
      <Persons persons={filterPersons} handleDeletion={handleDeletion} />
    </div>
  );
};

export default App;
