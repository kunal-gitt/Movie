import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./Components/MovieList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState(null);
  const [title, settitle] = useState("");
  const [opening_text, setopeningtext] = useState("");
  const [release_date, setreleasedate] = useState("");

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    seterror(null);

    try {
      const response = await fetch("https://swapi.dev/api/films");

      if (!response.ok) {
        throw new Error("Something went wrong...!");
      }
      const data = await response.json();

      const transformedMovies = data.results.map((moviedata) => {
        return {
          id: moviedata.episode_id,
          title: moviedata.title,
          openingText: moviedata.opening_crawl,
          releaseDate: moviedata.release_date,
        };
      });
      setMovies(transformedMovies);
    } catch (error) {
      seterror(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

  let content = <p>found no movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  const submithandler = (e) => {
    e.preventDefault();
    const NewMovieObj = {
      title: title,
      openingtext: opening_text,
      releasedate: release_date,
    };

    console.log(NewMovieObj);
  };

  const titlechange = (e) => {
    settitle(e.target.value);
  };

  const openingtext = (e) => {
    setopeningtext(e.target.value);
  };

  const releasedate = (e) => {
    setreleasedate(e.target.value);
  };

  return (
    <React.Fragment>
      <form onSubmit={submithandler}>
        <label>Title</label>
        <input type="text" onChange={titlechange}></input>
        <br />
        <label>Opening Text</label>
        <input type="text" onChange={openingtext}></input>
        <br />
        <label>Release Date</label>
        <input type="text" onChange={releasedate}></input>
        <br />
        <button>Add Movie</button>
        <br />
      </form>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
