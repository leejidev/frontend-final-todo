"use client";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { useSettings } from "@/hooks/useSettings";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function TodoInput() {
  const [text, setText] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useSettings();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() === "" || isSaving) return;

    // 💡 [과제 5] Firestore에 할 일을 저장한 후 입력을 초기화합니다.
    setIsSaving(true);
    setError(null);
    try {
      await addDoc(collection(db, "todos"), {
        text: text.trim(),
        isDone: false,
        createdAt: serverTimestamp(),
      });
      setText("");
    } catch (error) {
      const code = error instanceof FirebaseError ? ` (${error.code})` : "";
      setError(
        `저장하지 못했습니다${code}. Firebase 연결과 Firestore 설정을 확인해 주세요.`,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "8px",
        marginBottom: "24px",
      }}
    >
      <input
        value={text}
        disabled={isSaving}
        onChange={(e) => setText(e.target.value)}
        placeholder="할 일을 입력하세요"
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: "8px",
          border: theme === "dark" ? "1px solid #555" : "1px solid #ddd",
          backgroundColor: theme === "dark" ? "#262626" : "white",
          color: "inherit",
          fontSize: "1rem",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          backgroundColor: "#4f46e5",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        {isSaving ? "저장 중…" : "추가"}
      </button>
      {error && (
        <p role="alert" style={{ flexBasis: "100%" }}>
          {error}
        </p>
      )}
    </form>
  );
}
