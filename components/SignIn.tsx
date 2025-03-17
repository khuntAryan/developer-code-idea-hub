// SignIn.tsx (Client Component)
"use client";

import { signInWithProvider } from "./actions/authActions";
import { useState } from "react";

const SignIn = () => {
  const [provider, setProvider] = useState("github");

  return (
    <form action={() => signInWithProvider(provider)}>
      <label htmlFor="provider">Choose a provider: </label>
      <select id="provider" onChange={(e) => setProvider(e.target.value)}>
        <option value="github">GitHub</option>
        <option value="google">Google</option>
        <option value="apple">Apple</option>
      </select>

      <button type="submit">Sign In</button>
    </form>
  );
};

export default SignIn;
