import * as React from "react";
import { AppProvider } from "@toolpad/core/AppProvider";
import { SignInPage } from "@toolpad/core/SignInPage";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { signInRequest } from "../services/authServices";

const providers = [{ id: "credentials", name: "Email and Password" }];

const signIn = async (provider, formData, navigate) => {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const token = await signInRequest(email, password);
    console.log(token, "Token received");

    localStorage.setItem("authToken", token);

    navigate("/");
  } catch (error) {
    alert("Sign-in failed! Please check your credentials.");
  }
};

export default function CredentialsSignInPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={(provider, formData) => signIn(provider, formData, navigate)}
        providers={providers}
      />
    </AppProvider>
  );
}
