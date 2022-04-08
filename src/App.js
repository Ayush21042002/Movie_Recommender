import { useState, useEffect } from 'react'
import './App.css';
import Footer from './components/Footer';
import Header from './components/Header';
import MovieList from './components/MovieList';
import Search from './components/Search';
import SuggestionList from './components/SuggestionList';

function App() {

  const [searchTerm, setSearchTerm] = useState('')
  const [movieId, setMovieId] = useState('')
  const [movieInfo, setMovieInfo] = useState([])
  const [moviesList, setMoviesList] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [topRatedMovies, setTopRatedMovies] = useState([])
  const [popularMovies, setPopularMovies] = useState([])
  const [recommendedMovies, setRecommendedMovies] = useState([])
  
  useEffect(() => {
    fetch('/get_movies_list').then(
      res => res.json()
    ).then(
      data => setMoviesList(data)
    )
    fetch('/get_popular_movies').then(
      res => res.json()
    ).then(
      data => setPopularMovies(data)
    )
    fetch("/get_top_rated_movies")
      .then((res) => res.json())
      .then((data) => setTopRatedMovies(data));
  }, [])

  useEffect(() => {
    if(movieId !== ""){
      fetch("/get_movie_info?id=" + movieId)
        .then((res) => res.json())
        .then((data) => setMovieInfo(data));
      fetch("/get_recommended_movies?id=" + movieId)
        .then((res) => res.json())
        .then((data) => setRecommendedMovies(data));
    }
  }, [movieId])

  const inputChangeHandler = (text) => {
    setSearchTerm(text)
    if(text !== ""){
      const regex = new RegExp(`${text}`,"gi");
      let matches = []
      matches = moviesList.filter((movie,i) => {
        return movie.title_y.match(regex)
      })
      setSuggestions(matches)
    }else{
      setSuggestions([])
    }
  }

  const onSuggestionClickHandler = (id,text) => {
    setSearchTerm(text)
    setMovieId(id)
    setSuggestions([])
  }

  return (
    <div className="app">
      <Header />
      <Search
        inputChangeHandler={inputChangeHandler}
        searchTerm={searchTerm}
        setSuggestions={setSuggestions}
      />

      <SuggestionList suggestions={suggestions} onSuggestionClickHandler={onSuggestionClickHandler} />

      {movieInfo.length > 0 &&
        movieInfo.map((movie, i) => (
          <div key={i}>
            <div className="row">
              <div className="col-md-6">
                <div className="details">
                  <div className="row1">
                    <img src={movie.image_url} alt={movie.title_y} />
                    <div className="overview_box">
                      <h1>{movie.title_y}</h1>
                      <p className="overview">{movie.overview_y}</p>
                    </div>
                  </div>
                  <br />
                  <div>
                    <h2>Genres: </h2>
                    <p>
                      {movie.genres
                        .replace(/[^\w\s,]|_/g, "")
                        .replace(/\s+/g, " ")}
                    </p>
                  </div>
                  <br />
                  <div>
                    <h2>Cast: </h2>
                    <p>
                      {movie.cast
                        .replace(/[^\w\s,]|_/g, "")
                        .replace(/\s+/g, " ")}
                    </p>
                  </div>
                  <br />
                  <div>
                    <h2>Rating: </h2>
                    <p>{movie.vote_average_x}</p>
                  </div>
                  <br />
                  <div>
                    <h2>Votes: </h2>
                    <p>{movie.vote_count_x}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      {movieInfo.length > 0 && recommendedMovies.length > 0 && (
        <MovieList setMovieId={setMovieId} title={"Movies similar to " + movieInfo[0].title_y} moviesList={recommendedMovies} />
      )}
      <div className="horizontal_list_movie">
        <MovieList setMovieId={setMovieId} moviesList={topRatedMovies} title={"Top Rated Movies"} />
      </div>
      <div className="horizontal_list_movie">
        <MovieList setMovieId={setMovieId} moviesList={popularMovies} title={"Popular Movies"} />
      </div>
      <Footer/>
    </div>
  );
}

export default App;
