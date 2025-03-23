"use client";

import { useState, useEffect } from "react";
import { Tldraw, createTLStore, defaultShapeUtils } from "tldraw";
import "tldraw/tldraw.css";

export default function App() {

  const [store] = useState(() => createTLStore({ shapeUtils: defaultShapeUtils }));


  useEffect(() => {
    const savedData = localStorage.getItem("tldraw-data");
    if (savedData) {
      store.loadSnapshot(JSON.parse(savedData));
    }
  }, [store]);


  useEffect(() => {
    const handleBeforeUnload = () => {
      const snapshot = store.getSnapshot();
      localStorage.setItem("tldraw-data", JSON.stringify(snapshot));
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [store]);

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw store={store} />
    </div>
  );
}
