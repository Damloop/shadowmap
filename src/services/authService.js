// src/services/authService.js
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export async function register(data) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.msg || "Error en el registro");
  }

  return res.json();
}

export async function login(data) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.msg || "Credenciales inválidas");
  }

  return res.json(); // aquí esperas { token, user } o similar
}

export async function me(token) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("No autorizado");
  }

  return res.json();
}
