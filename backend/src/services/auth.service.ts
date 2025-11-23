import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import prisma from "../config/database.js";
import { decrypt, encrypt } from "./crypto.service.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "change-me-super-secret";
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? "7d") as NonNullable<
  SignOptions["expiresIn"]
>;

export async function login(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error("아이디 또는 비밀번호가 올바르지 않습니다.");
  }

  const signOptions: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      tier: user.tier,
      role: user.role,
    },
    JWT_SECRET,
    signOptions
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      name: decrypt(user.name) ?? "",
      tier: user.tier,
      role: user.role,
    },
  };
}

export async function register(data: {
  username: string;
  password: string;
  name: string;
  phone?: string;
  address?: string;
  tag: string;
  role: string;
}) {
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username: data.username }, { tag: data.tag }],
    },
  });

  if (existing) {
    throw new Error("이미 사용 중인 아이디 또는 태그입니다.");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      password: hashedPassword,
      name: encrypt(data.name) ?? "",
      phone: data.phone ? encrypt(data.phone) ?? "" : null,
      address: data.address ? encrypt(data.address) ?? "" : null,
      tag: data.tag,
      tier: 4,
      role: data.role,
    },
  });

  return {
    id: user.id,
    username: user.username,
    tier: user.tier,
  };
}
