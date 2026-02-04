import axios from "./axios"; // your existing axios instance

export function generateTests(payload) {
  return axios.post("/ai/generate", payload);
}
