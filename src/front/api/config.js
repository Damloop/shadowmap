// src/front/api/config.js

// ============================================================
// URL DEL BACKEND — CONFIGURACIÓN FINAL SHADOWMAP
// ============================================================
// 1. Si existe VITE_BACKEND_URL → se usa
// 2. Si no existe → fallback al backend público real
// ============================================================

export const API_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "https://solid-goldfish-xj5599r4x942vrp4-3001.app.github.dev";
