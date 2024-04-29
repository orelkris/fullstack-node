const Person = ({ person, handleDeletion }) => {
  return (
    <div>
      <span>
        {person.name} {person.phoneNumber}
      </span>
      <button onClick={handleDeletion}>delete</button>
    </div>
  );
};

export default Person;
