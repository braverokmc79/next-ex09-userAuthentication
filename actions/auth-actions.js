"use server";
import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/users";
import {  redirect } from "next/navigation";

export async function signup({ email, password }) {
  console.log(email, password);

  let errors = {};
  if (!email.includes("@")) {
    errors.email = "이메일 정보가 유효하지 않습니다.";
  }

  if (password.trim().length < 4) {
    errors.password = "비밀번호는 적어도 4글자 이상이어야 합니다.";
  }

  if (Object.keys(errors).length > 0) {
    console.log("에러 반환 처리");
    return { errors: errors };
  }

  const hashedPassword = hashUserPassword(password);

  try {
    createUser(email, hashedPassword);
  } catch (error) {
    console.log(error);

    if(error.code ==='SQLITE_CONSTRAINT_UNIQUE'){
      return {
        errors: {
          email:"이미 등록된 이메일 입니다."
        },
      };
    }
    throw error;
  }

  redirect('/training');
  
}
