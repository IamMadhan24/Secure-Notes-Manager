import "./Search.css";

const Search = ({ searchTerm, onSearch }) => {
  return (
    <div className="form-container">
      <form className="search-container" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search notes..."
          className="search"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />

        {searchTerm && (
          <button
            type="button"
            className="search-btn"
            onClick={() => onSearch("")}
          >
            ✕
          </button>
        )}
      </form>
    </div>
  );
};

export default Search;
