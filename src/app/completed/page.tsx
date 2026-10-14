// 💡 [과제 7] 이 페이지는 완료된 할 일만 보여야 합니다.
//    아래처럼 TodoList 컴포넌트를 재활용하되, 진입 시 Redux filter를 '완료'로 고정하는 방식입니다.
"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setFilter } from "@/store/todoSlice";
import TodoList from "@/components/todo/TodoList";

export default function CompletedPage() {
  const dispatch = useDispatch();

  // 이 페이지에 진입하면 필터를 '완료'로 자동 설정합니다.
  useEffect(() => {
    dispatch(setFilter("완료"));
  }, [dispatch]);

  return (
    <>
      <h1 style={{ marginBottom: "20px" }}>✅ 완료된 할 일</h1>
      <TodoList completedOnly />
    </>
  );
}
