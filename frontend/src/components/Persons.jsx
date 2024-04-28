import Person from "./Person";

const Persons = ({ persons, handleDeletion }) => {
  return (
    <>
      {persons.map((person) => (
        <Person
          key={person.id}
          person={person}
          handleDeletion={() => handleDeletion(person.id)}
        />
      ))}
    </>
  );
};

export default Persons;
