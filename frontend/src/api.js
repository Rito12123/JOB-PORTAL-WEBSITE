const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Example API call to fetch jobs
export async function fetchJobs() {
  const response = await fetch(`${API_BASE_URL}/job/all`);
  if (!response.ok) throw new Error("Failed to fetch jobs");
  return await response.json();
}

// Add more API calls here like fetchUsers, fetchProfile, etc.
