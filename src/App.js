import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./Components/MovieList";
import AddMovie from "./Components/Addmovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, seterror] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    seterror(null);

    try {
      const response = await fetch(
        "https://react-http-bbcb8-default-rtdb.firebaseio.com/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong...!");
      }
      const data = await response.json();

      const loadedmovies = [];

      for (const key in data) {
        loadedmovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      setMovies(loadedmovies);
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

  const addMovieHandler = async (movie) => {
    const response = await fetch(
      "https://react-http-bbcb8-default-rtdb.firebaseio.com/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
  };

  const deleteMovieHandler = async () => {
    const response = await fetch(
      "https://react-http-bbcb8-default-rtdb.firebaseio.com/movies.json/NTrqzZqz9HzlqumLn3m",
      {
        method: "DELETE",
      }
    );
    const data = response.json();

    const loadedmovies = [];

    for (const key in data) {
      loadedmovies.pop({
        id: key,
        title: data[key].title,
        openingText: data[key].openingText,
        releaseDate: data[key].releaseDate,
      });
    }

    setMovies(loadedmovies);
  };

  return (
    <React.Fragment>
      <AddMovie onAddMovie={addMovieHandler} />
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
        <button onClick={deleteMovieHandler}>Delete Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
