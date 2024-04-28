const Filter = ({ handleFilterInput, filterInput }) => {
  return (
    <form>
      <label htmlFor="filterPhonebook">filter shown with</label>
      <input
        id="filterPhonebook"
        value={filterInput}
        onChange={handleFilterInput}
      />
    </form>
  );
};

export default Filter;
