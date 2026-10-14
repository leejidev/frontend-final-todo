"use client";
import { useEffect, useState } from "react";
import { useSettings } from "@/hooks/useSettings";
import { db } from "@/lib/firebase";
import { Todo } from "@/types/todo";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function TodoList({
  completedOnly = false,
}: {
  completedOnly?: boolean;
}) {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromCache, setIsFromCache] = useState(true);
  const [hasPendingWrites, setHasPendingWrites] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { filter, theme } = useSettings();

  // 💡 [과제 4] onSnapshot으로 "todos" 컬렉션을 실시간 구독하세요.
  //    createdAt 기준 내림차순(desc) 정렬
  //    가져온 데이터를 setTodos로 업데이트하세요.
  //    컴포넌트 언마운트 시 구독을 해제하는 클린업 함수를 return하세요.
  useEffect(() => {
    const todosQuery = query(
      collection(db, "todos"),
      orderBy("createdAt", "desc"),
    );
    const unsubscribe = onSnapshot(
      todosQuery,
      { includeMetadataChanges: true },
      (snapshot) => {
        setIsLoading(false);
        setIsFromCache(snapshot.metadata.fromCache);
        setHasPendingWrites(snapshot.metadata.hasPendingWrites);
        setError(null);
        setTodos(
          snapshot.docs.map((document) => {
            const data = document.data();
            return {
              id: document.id,
              text: data.text,
              isDone: data.isDone,
              createdAt: data.createdAt,
            };
          }),
        );
      },
      (error) => {
        setIsLoading(false);
        setError(
          `목록을 불러오지 못했습니다 (${error.code}). Firebase의 Firestore 활성화 여부와 읽기 권한을 확인해 주세요.`,
        );
      },
    );

    return unsubscribe;
  }, []);

  // 💡 [과제 6] 완료/미완료 토글 — updateDoc으로 isDone 값을 반전시키세요.
  const handleToggle = async (todo: Todo) => {
    await updateDoc(doc(db, "todos", todo.id), { isDone: !todo.isDone });
  };

  // 💡 [추가 과제 1] Firestore에서 해당 할 일을 삭제합니다.
  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));
  };

  // Redux filter 상태로 목록을 필터링합니다.
  const filtered = todos.filter((t) => {
    if (completedOnly) return t.isDone;
    if (filter === "진행 중") return !t.isDone;
    if (filter === "완료") return t.isDone;
    return true; // 'all'
  });

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {error && <li role="alert">{error}</li>}
      {!error && (isLoading || isFromCache) && (
        <li role="status">Firestore 서버 연결을 기다리고 있습니다.</li>
      )}
      {hasPendingWrites && (
        <li role="status">아직 서버에 저장되지 않은 변경 사항이 있습니다.</li>
      )}
      {filtered.map((todo) => (
        <li
          key={todo.id}
          onClick={() => handleToggle(todo)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "14px 18px",
            marginBottom: "10px",
            backgroundColor: theme === "dark" ? "#262626" : "white",
            border: theme === "dark" ? "1px solid #444" : "1px solid #eee",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
          }}
        >
          <span>{todo.isDone ? "✅" : "⬜"}</span>
          <span
            style={{
              flex: 1,
              textDecoration: todo.isDone ? "line-through" : "none",
              opacity: todo.isDone ? 0.6 : 1,
            }}
          >
            {todo.text}
          </span>
          <button
            type="button"
            aria-label={`${todo.text} 삭제`}
            onClick={(event) => {
              event.stopPropagation();
              void handleDelete(todo.id);
            }}
            style={{
              color: theme === "dark" ? "#fca5a5" : "#b91c1c",
              cursor: "pointer",
              padding: "4px 8px",
            }}
          >
            삭제
          </button>
        </li>
      ))}
      {!error && !isLoading && !isFromCache && filtered.length === 0 && (
        <li
          style={{
            textAlign: "center",
            color: theme === "dark" ? "#aaa" : "#666",
          }}
        >
          {todos.length > 0
            ? "현재 필터에 해당하는 항목이 없습니다."
            : "항목이 없습니다."}
        </li>
      )}
    </ul>
  );
}
