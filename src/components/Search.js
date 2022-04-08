function Search({searchTerm,inputChangeHandler,setSuggestions}) {
    return (
      <div>
        <input
          className="input"
          value={searchTerm}
          placeholder="Search Movie For Recommendations"
          onChange={(e) => inputChangeHandler(e.target.value)}
          onBlur={(e) => {
            setTimeout(() => {
              setSuggestions([]);
            }, 1000);
          }}
        />
      </div>
    );
}

export default Search
