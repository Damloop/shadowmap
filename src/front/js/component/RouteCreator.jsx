import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";

const RouteCreator = () => {
  const { store, actions } = useContext(Context);

  const [name, setName] = useState("");
  const [rating, setRating] = useState(3);
  const [notes, setNotes] = useState("");

  if (!Array.isArray(store.selectedPoints) || store.selectedPoints.length < 5) {
    return null;
  }

  const publish = () => {
    actions.publishRoute({
      name,
      rating,
      notes,
      points: store.selectedPoints
    });
  };

  return (
    <div className="route-panel">
      <h2 className="route-title">NEW PARANORMAL ROUTE</h2>

      <input
        type="text"
        placeholder="Route name..."
        value={name}
        onChange={e => setName(e.target.value)}
        className="route-input"
      />

      <label className="route-label">Rating</label>
      <select
        value={rating}
        onChange={e => setRating(e.target.value)}
        className="route-select"
      >
        <option value="1">★☆☆☆☆</option>
        <option value="2">★★☆☆☆</option>
        <option value="3">★★★☆☆</option>
        <option value="4">★★★★☆</option>
        <option value="5">★★★★★</option>
      </select>

      <label className="route-label">Notes</label>
      <textarea
        placeholder="Whispers, anomalies, strange events..."
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="route-textarea"
      />

      <button className="route-btn" onClick={publish}>
        Publish Route
      </button>
    </div>
  );
};

export default RouteCreator;
