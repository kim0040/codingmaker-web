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
