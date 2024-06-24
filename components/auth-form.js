"use client";
import { signup } from "@/actions/auth-actions";
import Link from "next/link";
import { useState } from "react";
 
// 커스텀 훅 정의
// 이 훅은 폼 상태와 폼 제출 동작을 관리합니다.
function useFormState(action) {
  const [formState, setFormState] = useState({ errors: {} });
 
  // 폼 제출 동작 정의
  // 폼 제출 시 호출되며, 서버 액션을 실행하고 결과에 따라 상태를 업데이트합니다.
  const formAction = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get("email");
    const password = formData.get("password");
 
    try {
      // 서버 액션 호출 및 결과 처리
      const response = await action({ email, password });
      if (response.errors) {
        setFormState({ errors: response.errors });
      } else {
        setFormState({ errors: {} });
      }
    } catch (errors) {
      setFormState({ errors });
    }
  };
 
  return { formState, formAction };
}
 
export default function AuthForm() {
  // useFormState 훅을 사용하여 폼 상태와 폼 제출 동작을 가져옵니다.
  const { formState, formAction } = useFormState(signup);
 
  return (
    <form id="auth-form" onSubmit={formAction}>
      <div>
        <img src="/images/auth-icon.jpg" alt="A lock icon" />
      </div>
      <p>
        <label htmlFor="email">이메일</label>
        <input type="email" name="email" id="email" required />
      </p>
      <p>
        <label htmlFor="password">비밀번호</label>
        <input type="password" name="password" id="password" required />
      </p>
 
      <div>
        {/* 폼 상태에 오류가 있는 경우 오류 메시지를 표시합니다. */}
        {formState.errors && (
          <ul id="form-errors">
            {Object.keys(formState.errors).map((error) => (
              <li key={error}>{formState.errors[error]}</li>
            ))}
          </ul>
        )}
      </div>
 
      <p>
        <button type="submit">유저 생성</button>
      </p>
      <p>
        <Link href="/">Login with existing account.</Link>
      </p>
    </form>
  );
}