const Search = ({ searchTerm, onSearch }) => {
  return (
    <div className="mx-4">
      <form className="flex justify-between bg-white/20 rounded-full shadow-lg overflow-hidden w-full max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search notes..."
          className="w-full px-4 py-3 text-white focus:outline-none border-none mx-2
         max-sm:p-2"
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />

        {searchTerm && (
          <button
            type="button"
            className="px-6 py-3 text-white bg-white/30 font-medium cursor-pointer hover:bg-white/40 transition
         max-sm:px-3 max-sm:py-2 max-sm:text-sm"
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
