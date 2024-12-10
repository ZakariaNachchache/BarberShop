import axios from "axios";

export const signInRequest = async (email, password) => {
  console.log("sidno");
  try {
    const response = await axios.post("http://localhost:3000/auth/login", {
      email,
      password,
    });
    console.log(response.data.token);

    if (response.status === 200) {
      return response.data.token;
    } else {
      throw new Error("Sign-in failed");
    }
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error;
  }
};
