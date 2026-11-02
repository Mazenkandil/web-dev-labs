import React, { useState } from "react";
function MovieCard({ movie, onRemove }) {
  return (
    <article className="movie-card">
      <div className="movie-info">
        <h3>{movie.title}</h3>

        <p className="rating">
          <span className="stars">
            {"⭐".repeat(movie.rating)}
          </span>
          <span className="rating-number">{movie.rating}/5</span>
        </p>

        <p className="review">
          {movie.review || "No review added."}
        </p>
      </div>

      <button
        className="remove-button"
        type="button"
        onClick={() => onRemove(movie.id)}
      >
        Remove
      </button>
    </article>
  );
}

export default MovieCard;
