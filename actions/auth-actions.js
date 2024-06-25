"use server";
import { createAuthSession } from "@/lib/auth";
import { hashUserPassword, verifyPassword } from "@/lib/hash";
import { createUser, getUser, getUserByEmail } from "@/lib/users";
import {  redirect } from "next/navigation";


/**
 * 회원가입
*/
export async function signup({ email, password }) {
  
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

/**
 * 로그인 처리
*/
export async function login({ email, password }){
  console.log("로그인 처리");
    
  //유효성 체크
  let errors = {};
  if (email.trim().length<0 || password.trim().length) {
    errors.email = "입력 정보가 유효하지 않습니다.";
  }

  const existingUser=getUserByEmail(email);
  if(!existingUser) {
    return {
      errors: {
        email:"등록된 회원이 아닙니다."
      },
    };
  }


 const isValidPassword=verifyPassword(existingUser.password, password);
 if(!isValidPassword) {
    return {
      errors: {
        password:"비밀번호가 일치 하지 않습니다."
      },
    };
 }

  await createAuthSession(existingUser.id);
  redirect('/training');

}



export async function auth(mode, formData){
  if(mode === 'login'){
    return await login(formData);
  }
  
  return await signup(formData);
}