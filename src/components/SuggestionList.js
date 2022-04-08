function SuggestionList({suggestions,onSuggestionClickHandler}) {
    return (
      <div className="suggestion_list">
        {suggestions.length > 0 &&
          suggestions.map((movie, i) => (
            <div
              key={movie.id}
              className="suggestion"
              onClick={(e) => onSuggestionClickHandler(movie.id, movie.title_y)}
              onClickCapture={(e) =>
                onSuggestionClickHandler(movie.id, movie.title_y)
              }
            >
              {movie.title_y}
            </div>
          ))}
      </div>
    );
}

export default SuggestionList
