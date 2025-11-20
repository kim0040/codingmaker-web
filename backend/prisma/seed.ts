import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { encrypt } from "../src/services/crypto.service.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // 1. 관리자 계정 생성
  const adminPassword = await bcrypt.hash("admin1234", 10);
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: adminPassword,
      name: encrypt("관리자") ?? "",
      phone: encrypt("061-745-3355") ?? "",
      address: encrypt("전남 광양시 무등길 47") ?? "",
      tag: "0000",
      tier: 1,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.username);

  // 2. 학원 정보 초기화
  await prisma.academyInfo.upsert({
    where: { key: "INFO_NAME" },
    update: { value: "코딩메이커학원" },
    create: { key: "INFO_NAME", value: "코딩메이커학원" },
  });

  await prisma.academyInfo.upsert({
    where: { key: "INFO_PHONE" },
    update: { value: "061-745-3355" },
    create: { key: "INFO_PHONE", value: "061-745-3355" },
  });

  await prisma.academyInfo.upsert({
    where: { key: "INFO_ADDRESS" },
    update: { value: "전남 광양시 무등길 47 (중동 1549-9)" },
    create: { key: "INFO_ADDRESS", value: "전남 광양시 무등길 47 (중동 1549-9)" },
  });

  await prisma.academyInfo.upsert({
    where: { key: "INFO_HOURS" },
    update: { value: "평일 14:00~19:00, 토 14:00~17:00" },
    create: { key: "INFO_HOURS", value: "평일 14:00~19:00, 토 14:00~17:00" },
  });

  await prisma.academyInfo.upsert({
    where: { key: "INFO_BLOG" },
    update: { value: "https://blog.naver.com/kkj0201" },
    create: { key: "INFO_BLOG", value: "https://blog.naver.com/kkj0201" },
  });

  await prisma.academyInfo.upsert({
    where: { key: "INFO_INSTAGRAM" },
    update: { value: "@codingmaker_kj" },
    create: { key: "INFO_INSTAGRAM", value: "@codingmaker_kj" },
  });

  console.log("✅ Academy info created");

  // 3. 기본 커리큘럼 생성
  await prisma.course.upsert({
    where: { id: "course-embedded" },
    update: {},
    create: {
      id: "course-embedded",
      title: "임베디드 전문가 과정",
      category: "CODING",
      description: "C언어, 회로이론, 임베디드 시스템 학습",
      instructor: "박해커",
      schedule: "월수금 14:00~16:00",
      isActive: true,
    },
  });

  await prisma.course.upsert({
    where: { id: "course-webtoon" },
    update: {},
    create: {
      id: "course-webtoon",
      title: "웹툰 창작 과정",
      category: "MAKER",
      description: "웹툰 스토리텔링, 작화 기초",
      instructor: "김크리에이터",
      schedule: "화목 16:00~18:00",
      isActive: true,
    },
  });

  await prisma.course.upsert({
    where: { id: "course-cert" },
    update: {},
    create: {
      id: "course-cert",
      title: "컴퓨터활용능력 2급 실기",
      category: "CERTIFICATION",
      description: "컴활 2급 자격증 대비반",
      instructor: "이선생",
      schedule: "토 14:00~17:00",
      isActive: true,
    },
  });

  console.log("✅ Courses created");

  // 4. 강사 계정 생성
  const teacherPassword = await bcrypt.hash("teacher1234", 10);
  
  const teacher1 = await prisma.user.upsert({
    where: { username: "park_teacher" },
    update: {},
    create: {
      username: "park_teacher",
      password: teacherPassword,
      name: encrypt("박해커") ?? "",
      phone: encrypt("010-1111-2222") ?? "",
      tag: "1001",
      tier: 2,
      role: "TEACHER",
    },
  });

  const teacher2 = await prisma.user.upsert({
    where: { username: "kim_teacher" },
    update: {},
    create: {
      username: "kim_teacher",
      password: teacherPassword,
      name: encrypt("김크리에이터") ?? "",
      phone: encrypt("010-3333-4444") ?? "",
      tag: "1002",
      tier: 2,
      role: "TEACHER",
    },
  });

  console.log("✅ Teachers created");

  // 5. 학생 계정 생성 (20명)
  const studentPassword = await bcrypt.hash("student1234", 10);
  const studentNames = [
    "김민수", "이지은", "박서준", "최유나", "정민호",
    "강지우", "윤서연", "임도현", "한소희", "송민재",
    "오하늘", "장서윤", "신재원", "권예린", "배준혁",
    "남지호", "홍수아", "노태양", "황은비", "서지안"
  ];

  for (let i = 0; i < studentNames.length; i++) {
    await prisma.user.upsert({
      where: { username: `student${i + 1}` },
      update: {},
      create: {
        username: `student${i + 1}`,
        password: studentPassword,
        name: encrypt(studentNames[i]) ?? "",
        phone: encrypt(`010-${2000 + i}-${1000 + i}`) ?? "",
        tag: `${2000 + i}`,
        tier: 3,
        role: "STUDENT",
      },
    });
  }

  console.log("✅ Students created (20)");

  // 6. 학부모 계정 생성 (5명)
  const parentPassword = await bcrypt.hash("parent1234", 10);
  const parentNames = ["김학부모", "이학부모", "박학부모", "최학부모", "정학부모"];

  for (let i = 0; i < parentNames.length; i++) {
    await prisma.user.upsert({
      where: { username: `parent${i + 1}` },
      update: {},
      create: {
        username: `parent${i + 1}`,
        password: parentPassword,
        name: encrypt(parentNames[i]) ?? "",
        phone: encrypt(`010-${3000 + i}-${1000 + i}`) ?? "",
        tag: `${3000 + i}`,
        tier: 3,
        role: "PARENT",
      },
    });
  }

  console.log("✅ Parents created (5)");

  // 7. 커뮤니티 게시물 생성 (10개)
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    take: 10,
  });

  const postTitles = [
    "임베디드 과정 너무 재밌어요!",
    "C언어 포인터 질문있어요",
    "이번 주 프로젝트 발표 준비 중",
    "자격증 시험 합격했습니다!",
    "웹툰 그리기 팁 공유",
    "학원 오시는 길 안내",
    "방학 특강 언제 시작하나요?",
    "아두이노 프로젝트 성공!",
    "같이 공부하실 분 구해요",
    "선생님께 감사드립니다"
  ];

  const postContents = [
    "하드웨어 제어하는게 정말 신기해요. 다음 수업이 기대됩니다.",
    "이중 포인터 부분이 어려운데 도움 주실 분 계신가요?",
    "LED 제어 프로젝트 발표 준비하고 있어요. 화이팅!",
    "컴활 2급 실기 시험 합격했어요! 학원 수업 덕분입니다.",
    "인물 그릴 때 얼굴 비율 맞추는 법 알려드릴게요.",
    "버스 타고 오실 때는 중동 정류장에서 내리시면 됩니다.",
    "겨울방학 특강 일정이 궁금합니다.",
    "스마트팜 프로젝트 완성했어요! 센서가 제대로 작동해요.",
    "주말에 도서관에서 같이 복습하실 분 찾아요.",
    "박해커 선생님 항상 친절하게 가르쳐주셔서 감사합니다."
  ];

  for (let i = 0; i < Math.min(postTitles.length, students.length); i++) {
    const title = postTitles[i];
    const content = postContents[i];
    const author = students[i];
    
    if (title && content && author) {
      await prisma.post.create({
        data: {
          title,
          content,
          category: "GENERAL",
          authorId: author.id,
          views: Math.floor(Math.random() * 100),
        },
      });
    }
  }

  console.log("✅ Community posts created (10)");

  // 8. 출석 데이터 생성 (최근 7일)
  const allStudents = await prisma.user.findMany({
    where: { role: "STUDENT" },
  });

  const today = new Date();
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayOffset);
    date.setHours(0, 0, 0, 0); // 날짜만 설정
    
    // 각 학생마다 80% 확률로 출석
    for (const student of allStudents) {
      const rand = Math.random();
      let status = "PRESENT";
      
      if (rand > 0.9) {
        status = "ABSENT"; // 10% 결석
      } else if (rand > 0.85) {
        status = "LATE"; // 5% 지각
      }

      try {
        await prisma.attendance.create({
          data: {
            userId: student.id,
            date: date,
            status: status,
          },
        });
      } catch (e) {
        // 중복 데이터 무시
      }
    }
  }

  console.log("✅ Attendance records created (7 days)");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
