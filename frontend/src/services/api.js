const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";
export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Login failed");
  }
  return data;
};
let refreshPromise = null;
const refreshAccessToken = async () => {
  // Prevent multiple simultaneous requests from refreshing at once.
  if (refreshPromise) {
    return refreshPromise;
  }
  refreshPromise = (async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (!refresh) {
      throw new Error("No refresh token available.");
    }
    const response = await fetch(`${API_BASE_URL}/auth/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh }),
    });
    const data = await response.json();
    if (!response.ok || !data.access) {
      throw new Error("Session expired. Please log in again.");
    }
    localStorage.setItem("accessToken", data.access);
    // SimpleJWT may return a replacement refresh token too.
    if (data.refresh) {
      localStorage.setItem("refreshToken", data.refresh);
    }
    return data.access;
  })();
  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
};
const authFetch = async (url, options = {}) => {
  const makeRequest = (token) => {
    const headers = new Headers(options.headers || {});
    headers.set("Authorization", `Bearer ${token}`);
    if (options.body instanceof FormData) {
      headers.delete("Content-Type");
    } else if (options.body != null && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
    return fetch(url, { ...options, headers });
  };
  let token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("Please log in to access the dashboard.");
  }
  let response = await makeRequest(token);
  if (response.status !== 401) {
    return response;
  }
  try {
    token = await refreshAccessToken();
    response = await makeRequest(token);
    if (response.status === 401) {
      throw new Error("Session expired. Please log in again.");
    }
    return response;
  } catch (error) {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw error;
  }
};
const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};
export const getProjects = async () => {
  const response = await authFetch(`${API_BASE_URL}/projects/`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    console.log("Projects API status:", response.status);
    console.log("Projects API response:", data);
    throw new Error(
      data.detail || `Failed to fetch projects (${response.status})`
    );
  }
  return data;
};
export const getSkills = async () => {
  const response = await authFetch(`${API_BASE_URL}/skills/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch skills");
  }
  return response.json();
};
export const getExperience = async () => {
  const response = await authFetch(`${API_BASE_URL}/experience/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch experience");
  }
  return response.json();
};
export const getMessages = async () => {
  const response = await authFetch(`${API_BASE_URL}/contact/`, {
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }
  return response.json();
};
export const createProject = async (projectData) => {
  const response = await authFetch(`${API_BASE_URL}/projects/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: projectData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to create project");
  }
  return data;
};
export const updateProject = async (id, projectData) => {
  const response = await authFetch(`${API_BASE_URL}/projects/${id}/`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
    body: projectData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to update project");
  }
  return data;
};
export const deleteProject = async (id) => {
  const response = await authFetch(`${API_BASE_URL}/projects/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to delete project");
  }
  return true;
};
export const createSkill = async (skillData) => {
  const response = await authFetch(`${API_BASE_URL}/skills/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(skillData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to create skill");
  }
  return data;
};
export const updateSkill = async (id, skillData) => {
  const response = await authFetch(`${API_BASE_URL}/skills/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(skillData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to update skill");
  }
  return data;
};
export const deleteSkill = async (id) => {
  const response = await authFetch(`${API_BASE_URL}/skills/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete skill");
  }
  return true;
};
export const createExperience = async (experienceData) => {
  const response = await authFetch(`${API_BASE_URL}/experience/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(experienceData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to create experience");
  }
  return data;
};
export const updateExperience = async (id, experienceData) => {
  const response = await authFetch(`${API_BASE_URL}/experience/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(experienceData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to update experience");
  }
  return data;
};
export const deleteExperience = async (id) => {
  const response = await authFetch(`${API_BASE_URL}/experience/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete experience");
  }
  return true;
};
export const createEducation = async (educationData) => {
  const response = await authFetch(`${API_BASE_URL}/education/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(educationData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to create education");
  }
  return data;
};
export const updateEducation = async (id, educationData) => {
  const response = await authFetch(`${API_BASE_URL}/education/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(educationData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to update education");
  }
  return data;
};
export const deleteEducation = async (id) => {
  const response = await authFetch(`${API_BASE_URL}/education/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete education");
  }
  return true;
};
export const getEducation = async () => {
  const response = await authFetch(`${API_BASE_URL}/education/`, {
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch education");
  }
  return data;
};
export const updateMessage = async (id, messageData) => {
  const response = await authFetch(`${API_BASE_URL}/contact/${id}/`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(messageData),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Failed to update message");
  }
  return data;
};
export const deleteMessage = async (id) => {
  const response = await authFetch(`${API_BASE_URL}/contact/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    throw new Error("Failed to delete message");
  }
  return true;
};
export const submitContactMessage = async (messageData) => {
  const response = await fetch(
    `${API_BASE_URL}/public/contact/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    }
  );
  const data = await response.json();
  if (!response.ok) {
    if (data && typeof data === "object") {
      const firstError = Object.values(data)
        .flat()
        .find((value) => typeof value === "string");
      throw new Error(firstError || "Failed to send message.");
    }
    throw new Error("Failed to send message.");
  }
  return data;
};
// PUBLIC PORTFOLIO API FUNCTIONS
export const getPublicProjects = async () => {
  const response = await fetch(`${API_BASE_URL}/public/projects/`);
  if (!response.ok) {
    throw new Error("Failed to load projects.");
  }
  return response.json();
};
export const getPublicSkills = async () => {
  const response = await fetch(`${API_BASE_URL}/public/skills/`);
  if (!response.ok) {
    throw new Error("Failed to load skills.");
  }
  return response.json();
};
export const getPublicExperience = async () => {
  const response = await fetch(`${API_BASE_URL}/public/experience/`);
  if (!response.ok) {
    throw new Error("Failed to load experience.");
  }
  return response.json();
};
export const getPublicEducation = async () => {
  const response = await fetch(`${API_BASE_URL}/public/education/`);
  if (!response.ok) {
    throw new Error("Failed to load education.");
  }
  return response.json();
};