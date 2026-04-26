// src/front/api/config.js

// ============================================================
// URL DEL BACKEND — CORREGIDO
// ============================================================
// Si VITE_BACKEND_URL existe → se usa
// Si NO existe → usa el backend público real en Codespaces
// ============================================================

export const API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  "https://solid-goldfish-xj5599r4x942vrp4-3001.app.github.dev";


console.log("API_URL:", API_URL);
