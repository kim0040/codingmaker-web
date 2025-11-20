# 백엔드 설계 계획서 (3/4) - API 명세

> **코딩메이커 학원 통합 관리 시스템** API 설계  
> **작성일**: 2024-11-20  
> **Base URL**: `http://localhost:3001/api`

---

## 📋 목차

1. [API 개요](#1-api-개요)
2. [인증 API](#2-인증-api)
3. [출석 API](#3-출석-api)
4. [학원 정보 API](#4-학원-정보-api)
5. [커뮤니티 API](#5-커뮤니티-api)
6. [채팅 API](#6-채팅-api)
7. [친구 시스템 API](#7-친구-시스템-api)
8. [사용자 API](#8-사용자-api)
9. [커리큘럼 API](#9-커리큘럼-api)
10. [에러 응답](#10-에러-응답)

---

## 1. API 개요

### 1.1. 공통 규칙

#### Base URL
```
http://localhost:3001/api  (개발)
https://api.codingmaker.co.kr/api  (프로덕션)
```

#### 인증 헤더
```http
Authorization: Bearer <JWT_TOKEN>
```

#### 응답 포맷
```json
{
  "success": true,
  "data": { /* 응답 데이터 */ },
  "message": "Success"
}
```

#### 에러 응답
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### 1.2. HTTP 상태 코드

| 코드 | 의미 | 사용 예시 |
|------|------|----------|
| 200 | OK | 성공 |
| 201 | Created | 리소스 생성 성공 |
| 400 | Bad Request | 잘못된 요청 |
| 401 | Unauthorized | 인증 실패 |
| 403 | Forbidden | 권한 없음 |
| 404 | Not Found | 리소스 없음 |
| 429 | Too Many Requests | Rate Limit 초과 |
| 500 | Internal Server Error | 서버 오류 |

### 1.3. 페이지네이션

```json
{
  "data": [/* 항목 배열 */],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 2. 인증 API

### 2.1. 로그인

**POST** `/api/auth/login`

#### Request
```json
{
  "username": "student1",
  "password": "password123"
}
```

#### Response (200)
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "student1",
      "name": "김코딩",  // ⚠️ 복호화된 실명
      "tier": 3,
      "role": "STUDENT"
    }
  },
  "message": "로그인 성공"
}
```

#### 에러 (401)
```json
{
  "success": false,
  "error": "아이디 또는 비밀번호가 올바르지 않습니다.",
  "code": "AUTH_INVALID_CREDENTIALS"
}
```

---

### 2.2. 회원가입

**POST** `/api/auth/register`

#### Request
```json
{
  "username": "student2",
  "password": "password123",
  "name": "이학생",
  "phone": "010-1234-5678",
  "address": "광주시 북구",
  "tag": "1234",
  "role": "STUDENT"
}
```

#### Response (201)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "student2",
      "tier": 4  // 비정규회원으로 시작
    }
  },
  "message": "회원가입 완료"
}
```

---

### 2.3. 현재 사용자 정보

**GET** `/api/auth/me`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "student1",
    "name": "김코딩",
    "phone": "010-1234-5678",
    "tier": 3,
    "role": "STUDENT",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

---

### 2.4. 로그아웃

**POST** `/api/auth/logout`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "message": "로그아웃 완료"
}
```

---

## 3. 출석 API

### 3.1. 출석 체크

**POST** `/api/attendance/checkin`

**인증 필요 없음** (키오스크 공용 단말기)

#### Request
```json
{
  "tag": "1234"
}
```

#### Response (200)
```json
{
  "success": true,
  "data": {
    "studentName": "김코딩",
    "time": "2024-11-20T14:30:00Z",
    "status": "ATTENDED"
  },
  "message": "출석 완료!"
}
```

#### 에러 (404)
```json
{
  "success": false,
  "error": "등록되지 않은 태그입니다.",
  "code": "ATTENDANCE_TAG_NOT_FOUND"
}
```

---

### 3.2. 출석 내역 조회

**GET** `/api/attendance/user/:userId?month=2024-11`

**인증 필수** (본인 또는 관리자만)

#### Response (200)
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "month": "2024-11",
    "records": [
      {
        "id": "uuid",
        "date": "2024-11-20T14:30:00Z",
        "status": "ATTENDED"
      },
      {
        "id": "uuid",
        "date": "2024-11-19T14:35:00Z",
        "status": "LATE"
      }
    ],
    "stats": {
      "attended": 18,
      "late": 2,
      "absent": 1,
      "rate": 90.0
    }
  }
}
```

---

## 4. 학원 정보 API

### 4.1. 학원 정보 조회

**GET** `/api/academy/info`

**인증 불필요** (공개 정보)

#### Response (200)
```json
{
  "success": true,
  "data": {
    "name": "코딩메이커학원",
    "phone": "061-745-3355",
    "address": "전남 광양시 무등길 47 (중동 1549-9)",
    "hours": "평일 14:00~19:00, 토 14:00~17:00",
    "blog": "https://blog.naver.com/kkj0201",
    "instagram": "@codingmaker_kj"
  }
}
```

---

### 4.2. 학원 정보 수정

**PUT** `/api/academy/info`

**인증 필수** (Tier 1만)

#### Request
```json
{
  "phone": "061-745-3355",
  "address": "전남 광양시 무등길 47",
  "hours": "평일 14:00~19:00"
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "학원 정보가 수정되었습니다."
}
```

---

## 5. 커뮤니티 API

### 5.1. 게시글 목록

**GET** `/api/community/posts?page=1&category=all&sort=latest`

**인증 필수**

#### Query Parameters
- `page` (default: 1)
- `category` (all | 질문 | 공유 | 프로젝트 | 자유)
- `sort` (latest | popular)
- `limit` (default: 10)

#### Response (200)
```json
{
  "success": true,
  "data": {
    "posts": [
      {
        "id": "uuid",
        "title": "파이썬 프로젝트 팀원 구합니다",
        "author": {
          "id": "uuid",
          "name": "김민지",
          "role": "STUDENT"
        },
        "category": "프로젝트",
        "views": 256,
        "likes": 32,
        "commentCount": 7,
        "createdAt": "2024-11-19T10:00:00Z",
        "isPinned": false
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

---

### 5.2. 게시글 상세

**GET** `/api/community/posts/:id`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "파이썬 프로젝트 팀원 구합니다",
    "content": "<p>함께할 팀원을 찾습니다...</p>",
    "author": {
      "id": "uuid",
      "name": "김민지",
      "role": "STUDENT"
    },
    "category": "프로젝트",
    "views": 257,
    "likes": 32,
    "createdAt": "2024-11-19T10:00:00Z",
    "updatedAt": "2024-11-19T10:00:00Z",
    "comments": [
      {
        "id": "uuid",
        "content": "저도 참여하고 싶어요!",
        "author": {
          "id": "uuid",
          "name": "박해커"
        },
        "likes": 5,
        "createdAt": "2024-11-19T11:00:00Z"
      }
    ]
  }
}
```

---

### 5.3. 게시글 작성

**POST** `/api/community/posts`

**인증 필수** (Tier 3 이상)

#### Request
```json
{
  "title": "파이썬 프로젝트 팀원 구합니다",
  "content": "<p>함께할 팀원을 찾습니다...</p>",
  "category": "프로젝트"
}
```

#### Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "파이썬 프로젝트 팀원 구합니다",
    "createdAt": "2024-11-20T10:00:00Z"
  },
  "message": "게시글이 작성되었습니다."
}
```

---

### 5.4. 게시글 추천

**PUT** `/api/community/posts/:id/like`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "data": {
    "likes": 33,
    "isLiked": true
  },
  "message": "추천했습니다."
}
```

---

### 5.5. 댓글 작성

**POST** `/api/community/posts/:id/comments`

**인증 필수**

#### Request
```json
{
  "content": "저도 참여하고 싶어요!"
}
```

#### Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "content": "저도 참여하고 싶어요!",
    "author": {
      "id": "uuid",
      "name": "박해커"
    },
    "createdAt": "2024-11-20T11:00:00Z"
  },
  "message": "댓글이 작성되었습니다."
}
```

---

## 6. 채팅 API

### 6.1. 채팅방 목록

**GET** `/api/chat/rooms`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "id": "uuid",
        "type": "dm",
        "name": null,
        "members": [
          {
            "id": "uuid",
            "name": "김코딩"
          },
          {
            "id": "uuid",
            "name": "박해커"
          }
        ],
        "lastMessage": {
          "content": "과제 확인했습니다",
          "createdAt": "2024-11-20T14:20:00Z"
        },
        "unreadCount": 2
      }
    ]
  }
}
```

---

### 6.2. 채팅방 생성

**POST** `/api/chat/rooms`

**인증 필수**

#### Request (1:1 DM)
```json
{
  "type": "dm",
  "memberIds": ["target-user-uuid"]
}
```

#### Request (그룹 채팅)
```json
{
  "type": "group",
  "name": "임베디드 스터디",
  "memberIds": ["user1-uuid", "user2-uuid", "user3-uuid"]
}
```

#### Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "type": "group",
    "name": "임베디드 스터디",
    "members": [/* ... */],
    "createdAt": "2024-11-20T10:00:00Z"
  },
  "message": "채팅방이 생성되었습니다."
}
```

---

### 6.3. 메시지 내역

**GET** `/api/chat/rooms/:roomId/messages?page=1&limit=50`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "uuid",
        "content": "안녕하세요",  // ⚠️ 복호화된 메시지
        "author": {
          "id": "uuid",
          "name": "김코딩"
        },
        "isRead": true,
        "createdAt": "2024-11-20T14:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150
    }
  }
}
```

---

### 6.4. 메시지 전송 (Socket.io)

**Socket Event**: `chat:send-message`

#### Emit
```javascript
socket.emit('chat:send-message', {
  roomId: 'uuid',
  content: '안녕하세요'
});
```

#### Listen
```javascript
socket.on('chat:new-message', (data) => {
  console.log(data);
  // {
  //   id: 'uuid',
  //   content: '안녕하세요',
  //   author: { id: 'uuid', name: '김코딩' },
  //   createdAt: '2024-11-20T14:00:00Z'
  // }
});
```

---

## 7. 친구 시스템 API

### 7.1. 친구 요청

**POST** `/api/friends/request`

**인증 필수**

#### Request
```json
{
  "targetUserId": "uuid"
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "친구 요청을 보냈습니다."
}
```

---

### 7.2. 친구 요청 수락

**PUT** `/api/friends/:friendshipId/accept`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "message": "친구 요청을 수락했습니다."
}
```

---

### 7.3. 친구 목록

**GET** `/api/friends`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "data": {
    "friends": [
      {
        "id": "uuid",
        "name": "박해커",
        "role": "STUDENT",
        "status": "ACCEPTED",
        "createdAt": "2024-11-01T00:00:00Z"
      }
    ]
  }
}
```

---

### 7.4. 친구 삭제

**DELETE** `/api/friends/:friendshipId`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "message": "친구가 삭제되었습니다."
}
```

---

## 8. 사용자 API

### 8.1. 유저 프로필 조회

**GET** `/api/users/:userId/profile`

**인증 필수**

#### Response (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "김코딩",
    "role": "STUDENT",
    "tier": 3,
    "createdAt": "2024-01-01T00:00:00Z",
    "friendStatus": "ACCEPTED",  // NONE, PENDING, ACCEPTED
    "stats": {
      "enrolledClasses": 3,
      "completedProjects": 2,
      "posts": 15
    }
  }
}
```

---

### 8.2. 유저 신고

**POST** `/api/users/:userId/report`

**인증 필수**

#### Request
```json
{
  "reason": "스팸",
  "description": "광고성 게시글 반복 작성"
}
```

#### Response (200)
```json
{
  "success": true,
  "message": "신고가 접수되었습니다."
}
```

---

## 9. 커리큘럼 API

### 9.1. 커리큘럼 목록

**GET** `/api/courses?category=all`

**인증 필수** (Tier 3 이상)

#### Response (200)
```json
{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "uuid",
        "title": "임베디드 전문가 과정",
        "category": "CODING",
        "description": "C언어, 회로이론, 임베디드 시스템 학습",
        "instructor": "박해커",
        "schedule": "월수금 14:00~16:00",
        "isActive": true,
        "enrolledCount": 15
      }
    ]
  }
}
```

---

### 9.2. 커리큘럼 생성

**POST** `/api/courses`

**인증 필수** (Tier 1, 2)

#### Request
```json
{
  "title": "AI 활용 과정",
  "category": "CODING",
  "description": "ChatGPT, Stable Diffusion 활용",
  "instructor": "김선생",
  "schedule": "화목 16:00~18:00"
}
```

#### Response (201)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "AI 활용 과정"
  },
  "message": "커리큘럼이 생성되었습니다."
}
```

---

## 10. 에러 응답

### 10.1. 공통 에러 코드

| 코드 | HTTP | 설명 |
|------|------|------|
| `AUTH_INVALID_CREDENTIALS` | 401 | 로그인 실패 |
| `AUTH_TOKEN_EXPIRED` | 401 | 토큰 만료 |
| `AUTH_TOKEN_INVALID` | 401 | 유효하지 않은 토큰 |
| `PERMISSION_DENIED` | 403 | 권한 없음 |
| `RESOURCE_NOT_FOUND` | 404 | 리소스 없음 |
| `VALIDATION_ERROR` | 400 | 입력 검증 실패 |
| `RATE_LIMIT_EXCEEDED` | 429 | 요청 제한 초과 |
| `SERVER_ERROR` | 500 | 서버 오류 |

### 10.2. 에러 응답 예시

```json
{
  "success": false,
  "error": "권한이 없습니다.",
  "code": "PERMISSION_DENIED",
  "details": {
    "requiredTier": 1,
    "currentTier": 3
  }
}
```

---

## 📞 다음 단계

이 문서는 **3/4편 (API 명세)**입니다.

다음 문서를 읽어주세요:
- 📘 [4/4편 - 보안 구현](./BACKEND_DESIGN_PLAN_4_SECURITY.md)

---

**작성자**: AI Assistant (Cascade)  
**최종 수정**: 2024-11-20
