
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost/professor-api/";

const API = `${API_BASE.replace(/\/+$/, "")}/publications`;

async function getCsrfToken() {
  const response = await fetch(
    `${API_BASE}auth/session.php`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Session expired. Please log in again.");
  }

  const data = await response.json();

  if (!data.authenticated || !data.csrf_token) {
    throw new Error("CSRF token not available.");
  }

  return data.csrf_token;
}

async function readResponse(response) {
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function getPublications() {
  const response = await fetch(`${API}/get.php`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load publications");
  }

  const data = await response.json();
  return data.publications || [];
}

export async function savePublication(publication) {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API}/save.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify(publication),
  });

  return readResponse(response);
}

export async function deletePublication(id) {
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API}/delete.php`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRF-Token": csrfToken,
    },
    body: JSON.stringify({ id }),
  });

  return readResponse(response);
}
