import { useEffect, useState } from "react";
import { isCancel } from "axios";

import { getPopularMovies, searchMovies } from "./api/tmdb";
import MovieCard from "./components/MovieCard";
import "./App.css";

export default function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [chosenMovie, setChosenMovie] = useState(null);
  {
    /* I wasn't sure how else to implement loading new pages so I used
  useState as an alternative to however else it may be implemented. I
  think it could be argued to be inefficient / there are other ways to
  implement although this way works so */
  }

  const [page, setPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);

    setError(null);

    const request = search
      ? searchMovies(search, page, controller.signal)
      : getPopularMovies(page, controller.signal);

    request
      .then((data) => {
        if (page === 1) {
          setMovies(data);
        } else {
          setMovies((currentMovies) => [...currentMovies, ...data]);
        }

        setLoading(false);
      })
      .catch((err) => {
        if (isCancel(err)) return;

        setError("Couldn't load movies. Try again later.");

        setLoading(false);
      });

    return () => controller.abort();
  }, [search, page]);

  /* In hindsight, designing the details page to be like 
  this was probably not worth the effort although I figured
  since we used this technique for a previous assignment may
  as well try reusing it */

  const movieGrid = [];

  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];

    movieGrid.push(
      <MovieCard key={m.id} movie={m} onSelect={setChosenMovie} />,
    );

    if (chosenMovie && chosenMovie.id === m.id) {
      movieGrid.push(
        <div className="details" key={"details-" + m.id}>
          <h2>{chosenMovie.title}</h2>

          <p>{chosenMovie.overview}</p>

          <button onClick={() => setChosenMovie(null)}>Close</button>
        </div>,
      );
    }
  }

  return (
    <main className="app">
      <h1>Movie Explorer</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setSearch(query.trim());
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies…"
        />
        <button type="submit">Search</button>
      </form>
      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {!loading && !error && movies.length === 0 && search && (
        <p>No results for "{search}"</p>
      )}

      {/* I got rid of the loading parameter for creating the movie grid
because it was resetting the page every time it was loading / appending
new movies with the Load More button*/}

      {!error && movies.length > 0 && <div className="grid">{movieGrid}</div>}

      {!loading && !error && movies.length > 0 && (
        <button onClick={() => setPage(page + 1)}>Load More</button>
      )}
    </main>
  );
}
