import { cookies } from "next/headers"; // Next.js에서 쿠키를 다루기 위한 모듈을 가져옵니다.
import { Lucia } from "lucia"; // Lucia 인증 라이브러리를 가져옵니다.
import { BetterSqlite3Adapter } from '@lucia-auth/adapter-sqlite'; // SQLite 데이터베이스를 위한 Lucia 어댑터를 가져옵니다.

import db from './db'; // SQLite 데이터베이스 연결을 가져옵니다.

const adapter = new BetterSqlite3Adapter(db, {
    user: 'users', // 사용자 정보를 저장하는 테이블 이름을 설정합니다.
    session: 'sessions' // 세션 정보를 저장하는 테이블 이름을 설정합니다.
});

// Lucia 객체를 생성하고 설정을 구성합니다.
const lucia = new Lucia(adapter, {
    sessionCookie: {
        expires: false, // 세션 쿠키가 만료되지 않도록 설정합니다.
        attributes: {
            secure: process.env.NODE_ENV === 'production', // 프로덕션 환경에서는 쿠키를 안전하게 설정합니다.
        }
    }
});

/**
 * 주어진 사용자 ID로 인증 세션을 생성하고 세션 쿠키를 설정합니다.
 * @param {string} userId - 인증 세션을 생성할 사용자 ID
 */
export async function createAuthSession(userId) {
    // 주어진 사용자 ID로 새로운 세션을 생성합니다.
    const session = await lucia.createSession(userId, {});

    // 세션 ID로부터 세션 쿠키를 생성합니다.
    const sessionCookie = lucia.createSessionCookie(session.id);

    // 생성된 세션 쿠키를 클라이언트의 브라우저에 설정합니다.
    cookies().set(
        sessionCookie.name, // 쿠키의 이름을 설정합니다.
        sessionCookie.value, // 쿠키의 값을 설정합니다.
        sessionCookie.attributes // 쿠키의 속성을 설정합니다.
    );
}