import React from "react";
import SignIn from "./SignIn";
import { auth } from "../auth";
import Image from "next/image";
import SignOut from "./SignOut";

const Navbar = async () => {
  const session = await auth();
  return (
    <header className="min-w-full h-full bg-cyan-900 text-white p-5 justify-between flex flex-row items-center px-10">
      <div>
        <Image
          src="https://imgs.search.brave.com/BMi0KkXzFsJjWYC1nYZ-9ENGQ04eKlS8t3n8m9RhkWg/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMtcGxhdGZvcm0u/OTlzdGF0aWMuY29t/Ly9Jc2Q3S2dzWk9i/WS1BN3g5N0VpeE5R/SWU2Mlk9LzEwOHgz/Ojg1MHg3NDUvZml0/LWluLzUwMHg1MDAv/OTlkZXNpZ25zLWNv/bnRlc3RzLWF0dGFj/aG1lbnRzLzc2Lzc2/Mjk4L2F0dGFjaG1l/bnRfNzYyOTgyMTI"
          alt="logo"
          height={48}
          width={48}
        />
      </div>
      <div className="p-2 text-2x border-2 bg-gray-50 text-black rounded-2xl">
        {session?.user ? (
          <div>
            <SignOut />
          </div>
        ) : (
          <>
            <SignIn />
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
