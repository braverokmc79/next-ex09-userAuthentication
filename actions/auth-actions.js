"use server";
import { createAuthSession } from "@/lib/auth";
import { hashUserPassword } from "@/lib/hash";
import { createUser } from "@/lib/users";
import {  redirect } from "next/navigation";

export async function signup({ email, password }) {
  console.log("유효성 체크  :" ,email, password);

  //유효성 체크
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

  //비밀번호 암호화 
  const hashedPassword = hashUserPassword(password);

  try {
    const id=createUser(email, hashedPassword);

    //루시아를 통한 인증
    console.log(" 루시아를 통한 인증  :", id);
    await createAuthSession(id);
    
    
    redirect('/training');
  
  } catch (error) {
   // console.log(error);
    if(error.code ==='SQLITE_CONSTRAINT_UNIQUE'){
      return {
        errors: {
          email:"이미 등록된 이메일 입니다."
        },
      };
    }
    throw error;
  }

}
