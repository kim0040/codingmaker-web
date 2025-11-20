"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";

const tabs = [
  { value: "login", label: "로그인" },
  { value: "signup", label: "회원가입" },
];

export default function AuthPage() {
  const [mode, setMode] = useState<(typeof tabs)[number]["value"]>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6">
        <div className="flex w-full items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition-opacity">
            <span className="material-symbols-outlined text-3xl">data_object</span>
            <span className="text-lg font-bold">코딩메이커 아카데미 허브</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1">
              <span className="material-symbols-outlined text-base">home</span>
              <span className="hidden sm:inline">홈으로</span>
            </Button>
          </Link>
        </div>

        <div className="flex w-full flex-col gap-6 md:flex-row md:items-start">
          <Card className="w-full md:flex-1 border-border/70 bg-card shadow-lg">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-bold text-foreground">
                {mode === "login" ? "다시 만나 반가워요!" : "지금 바로 시작해요"}
              </CardTitle>
              <CardDescription>
                {mode === "login"
                  ? "코딩메이커 계정으로 로그인하고 학습 현황을 확인하세요."
                  : "맞춤형 커리큘럼을 위해 기본 정보를 입력해 주세요."}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pb-6">
              <div className="flex h-12 items-center rounded-2xl bg-muted p-1.5 text-sm font-semibold text-muted-foreground">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    className={`flex-1 rounded-xl px-3 py-2 transition-all ${
                      mode === tab.value
                        ? "bg-background text-foreground shadow-sm"
                        : "hover:text-foreground"
                    }`}
                    onClick={() => {
                      setMode(tab.value);
                      setError("");
                      setPassword("");
                      setPasswordConfirm("");
                      setShowPassword(false);
                      setShowPasswordConfirm(false);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <form className="space-y-3" onSubmit={async (e) => {
                e.preventDefault();
                setError("");
                setIsLoading(true);

                try {
                  if (mode === "login") {
                    await login(username, password);
                    router.push("/");
                  } else {
                    // 회원가입 시 비밀번호 확인
                    if (password !== passwordConfirm) {
                      setError("비밀번호가 일치하지 않습니다.");
                      setIsLoading(false);
                      return;
                    }
                    const response: any = await api.post(endpoints.auth.register, {
                      username,
                      password,
                      name,
                      phone,
                      tag: phone.slice(-4),
                      role: "STUDENT",
                    });
                    if (response.success) {
                      setMode("login");
                      setPassword("");
                      setPasswordConfirm("");
                      setError("회원가입이 완료되었습니다. 로그인해주세요.");
                    }
                  }
                } catch (err: any) {
                  setError(err?.message || "오류가 발생했습니다.");
                } finally {
                  setIsLoading(false);
                }
              }}>
                {mode === "signup" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Input 
                      placeholder="이름" 
                      aria-label="이름"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    <Input 
                      placeholder="연락처" 
                      aria-label="연락처"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                    {mode === "login" ? "아이디" : "아이디 (이메일)"}
                    <Input
                      type="text"
                      placeholder={mode === "login" ? "아이디" : "example@email.com"}
                      aria-label="아이디"
                      className="h-12"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                    비밀번호
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호" 
                        className="h-12 pr-12"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <span className="material-symbols-outlined text-xl">
                          {showPassword ? "visibility_off" : "visibility"}
                        </span>
                      </button>
                    </div>
                  </label>
                  {mode === "signup" && (
                    <label className="flex flex-col gap-2 text-sm font-medium text-foreground">
                      비밀번호 확인
                      <div className="relative">
                        <Input 
                          type={showPasswordConfirm ? "text" : "password"}
                          placeholder="비밀번호 확인" 
                          className="h-12 pr-12"
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">
                            {showPasswordConfirm ? "visibility_off" : "visibility"}
                          </span>
                        </button>
                      </div>
                      {passwordConfirm && password !== passwordConfirm && (
                        <span className="text-xs text-red-600 dark:text-red-400">비밀번호가 일치하지 않습니다</span>
                      )}
                      {passwordConfirm && password === passwordConfirm && (
                        <span className="text-xs text-green-600 dark:text-green-400">비밀번호가 일치합니다</span>
                      )}
                    </label>
                  )}
                </div>

                {error && (
                  <div className={`text-sm p-3 rounded-lg ${
                    error.includes("완료") 
                      ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" 
                      : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800"
                  }`}>
                    {error}
                  </div>
                )}

                {mode === "login" && (
                  <div className="text-right text-sm">
                    <Link
                      href="#"
                      className="font-medium text-primary hover:underline"
                    >
                      아이디/비밀번호를 잊으셨나요?
                    </Link>
                  </div>
                )}

                <Button 
                  type="submit"
                  className="h-12 w-full text-base font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? "처리 중..." : mode === "login" ? "로그인" : "회원가입"}
                </Button>
              </form>

            </CardContent>
          </Card>

          <Card className="hidden md:flex md:w-80 flex-col border-primary/20 bg-primary/5 text-primary">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">코딩메이커 학원 안내</CardTitle>
              <CardDescription className="text-primary/70 text-xs">
                상담 전 꼭 확인해 주세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="font-semibold">운영 시간</p>
                <p>평일 14:00~19:00 · 토요일 14:00~17:00</p>
              </div>
              <div>
                <p className="font-semibold">상담 채널</p>
                <p>홈페이지 · 네이버 블로그 · 구글폼 상담신청서</p>
              </div>
              <div>
                <p className="font-semibold">주소</p>
                <p>전남 광양시 무등길 47 (중동 1549-9)</p>
              </div>
              <div>
                <p className="font-semibold">특이사항</p>
                <p>임베디드/메이커 실습은 재료비가 발생할 수 있습니다.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
