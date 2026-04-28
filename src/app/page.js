"use client";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function Page() {
  const testWrite = async () => {
    try {
      const docRef = await addDoc(collection(db, "test"), {
        message: "it works",
        createdAt: Date.now(),
      });

      console.log("✅ Wrote document with ID:", docRef.id);
      alert("Firestore write successful!");
    } catch (err) {
      console.error("❌ Firestore error:", err);
      alert("Write failed — check console");
    }
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Firestore Test</h1>

      <button
        onClick={testWrite}
        style={{
          marginTop: 20,
          padding: "10px 16px",
          border: "1px solid black",
          cursor: "pointer",
        }}
      >
        Test Write to Firestore
      </button>
    </main>
  );
}