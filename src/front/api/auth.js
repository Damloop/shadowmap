// RUTA: /workspaces/shadowmap/src/front/api/auth.js

// URL pública del backend Flask en Codespaces (puerto 3001)
const API_URL = "https://solid-goldfish-xj5599r4x942vrp4-3001.app.github.dev/api";

export const registerUser = async ({ name, email, password, avatar }) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        avatar
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }

    return data;

  } catch (error) {
    console.error("Error en registerUser:", error);
    throw error;
  }
};
