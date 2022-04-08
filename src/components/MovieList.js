function MovieList({title,moviesList,setMovieId}) {
    return (
      <div className="horizontal_list_movie">
        <h1>{title}</h1>
        <div className="movie_list">
          {moviesList.length > 0 &&
            moviesList.map((movie) => (
              <img
                key={movie.id}
                src={movie.image_url}
                alt={movie.title_y}
                onClick={(e) => {
                  e.preventDefault();
                  setMovieId(movie.id);
                }}
              />
            ))}
        </div>
      </div>
    );
}

export default MovieList
