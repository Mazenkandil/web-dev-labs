import React, { useState } from "react";
import MovieCard from "./components/Moviecard.jsx";
function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [error, setError] = useState("");

  function addMovie(event) {
    event.preventDefault();

    if (title.trim() === "") {
      setError("Please enter a movie title.");
      return;
    }

    const newMovie = {
      id: Date.now(),
      title: title.trim(),
      rating: Number(rating),
      review: review.trim()
    };

    setMovies((previousMovies) => [...previousMovies, newMovie]);
    setTitle("");
    setRating(5);
    setReview("");
    setError("");
  }

  function removeMovie(id) {
    setMovies((previousMovies) =>
      previousMovies.filter((movie) => movie.id !== id)
    );
  }

  return (
    <main className="app">
      <header className="header">
        <p className="eyebrow">YOUR PERSONAL COLLECTION</p>
        <h1>Movie Watch List 🎬</h1>
        <p className="subtitle">
          Keep track of the movies you've watched and what you thought of them.
        </p>
      </header>

      <section className="form-section">
        <h2>Add a movie</h2>

        <form onSubmit={addMovie}>
          <label htmlFor="movie-title">Movie title</label>
          <input
            id="movie-title"
            type="text"
            placeholder="Enter movie title..."
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <label>Your rating</label>
          <div className="star-rating" role="group" aria-label="Choose a rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-button ${star <= rating ? "selected" : ""}`}
                onClick={() => setRating(star)}
                aria-label={`${star} star${star > 1 ? "s" : ""}`}
                aria-pressed={rating === star}
              >
                ★
              </button>
            ))}
            <span className="rating-number">{rating}/5</span>
          </div>

          <label htmlFor="movie-review">Your review (optional)</label>
          <textarea
            id="movie-review"
            placeholder="What did you think of the movie?"
            value={review}
            onChange={(event) => setReview(event.target.value)}
            rows="3"
          />

          {error && <p className="error">{error}</p>}

          <button className="add-button" type="submit">
            + Add Movie
          </button>
        </form>
      </section>

      <section className="movies-section">
        <div className="section-heading">
          <h2>Watched Movies</h2>
          <span className="movie-count">{movies.length} movies</span>
        </div>

        {movies.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🍿</span>
            <h3>Your list is empty</h3>
            <p>Add your first movie using the form above.</p>
          </div>
        ) : (
          <div className="movie-list">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onRemove={removeMovie}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default App;