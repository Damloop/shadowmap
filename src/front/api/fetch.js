const API_URL = import.meta.env.VITE_BACKEND_URL;

export async function getHealth() {
  const res = await fetch(`${API_URL}/api/health`);
  return await res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
}

export async function signup(email, password) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return await res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return await res.json();
}
