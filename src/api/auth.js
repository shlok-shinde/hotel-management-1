import axios from "axios";

export const login = async (email, password) => {
  try {
    const response = await axios.post("http://localhost:8000/auth/login", {
      email,
      password,
    });

    // Save token locally
    localStorage.setItem("token", response.data.token);
    return null; // no error
  } catch (error) {
    if (error.response) {
      return error.response.data.message || "Login failed";
    }
    return "Server unreachable";
  }
};
