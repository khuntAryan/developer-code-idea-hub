import { signOut } from "../auth";

import React from "react";

const SignOut = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut({ redirectTo: "/" });
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </>
  );
};

export default SignOut;
