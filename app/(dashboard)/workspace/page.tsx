"use client";

import React from "react";
import TLDrawEditor from "../../../components/TLDrawEditor";

const Workspace: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>tldraw Example</h1>
      <TLDrawEditor />
    </div>
  );
};

export default Workspace;
