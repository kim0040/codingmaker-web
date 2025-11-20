"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // 실제 구현 시 API 연동
    await new Promise(resolve => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
    
    // 3초 후 폼 초기화
    setTimeout(() => {
      setFormData({ name: "", phone: "", email: "", course: "", message: "" });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-6">
              <span className="material-symbols-outlined text-base">chat</span>
              상담 신청
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl mb-6">
              궁금한 점을 <span className="text-primary">남겨주세요</span>
            </h1>
            <p className="text-lg text-secondary mb-8 max-w-3xl mx-auto">
              빠른 시일 내에 연락드리겠습니다
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* 연락 정보 */}
            <Card>
              <CardContent className="p-6 text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4 block">call</span>
                <h3 className="font-bold mb-2">전화 상담</h3>
                <p className="text-sm text-muted-foreground mb-3">061-745-3355</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = "tel:061-745-3355"}
                >
                  전화 걸기
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4 block">chat</span>
                <h3 className="font-bold mb-2">블로그 문의</h3>
                <p className="text-sm text-muted-foreground mb-3">네이버 블로그</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://blog.naver.com/kkj0201", "_blank")}
                >
                  블로그 방문
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4 block">share</span>
                <h3 className="font-bold mb-2">Instagram</h3>
                <p className="text-sm text-muted-foreground mb-3">@codingmaker_kj</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("https://www.instagram.com/codingmaker_kj/", "_blank")}
                >
                  Instagram
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* 상담 신청 폼 */}
          <Card>
            <CardHeader>
              <CardTitle>온라인 상담 신청</CardTitle>
              <p className="text-sm text-muted-foreground">
                아래 정보를 입력하시면 빠른 시일 내에 연락드리겠습니다.
              </p>
            </CardHeader>
            <CardContent>
              {submitted ? (
                <div className="text-center py-12">
                  <span className="material-symbols-outlined text-6xl text-green-600 mb-4 block">check_circle</span>
                  <h3 className="text-2xl font-bold mb-2">상담 신청이 완료되었습니다!</h3>
                  <p className="text-muted-foreground">빠른 시일 내에 연락드리겠습니다.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        이름 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="홍길동"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        연락처 <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="010-1234-5678"
                        type="tel"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      이메일
                    </label>
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      type="email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      관심 과정 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleChange as any}
                      className="w-full px-3 py-2 border border-input bg-background rounded-md"
                      required
                    >
                      <option value="">선택해주세요</option>
                      <option value="embedded">코딩/임베디드 전문가 과정</option>
                      <option value="webtoon">웹툰·디지털 창작 과정</option>
                      <option value="certification">컴활 2급 실기 특강</option>
                      <option value="other">기타 (문의사항에 작성)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      문의사항
                    </label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="궁금하신 내용을 자유롭게 작성해주세요."
                      rows={5}
                    />
                  </div>

                  <div className="flex gap-4 justify-end">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setFormData({ name: "", phone: "", email: "", course: "", message: "" })}
                    >
                      초기화
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <span className="material-symbols-outlined mr-2 animate-spin">refresh</span>
                          제출 중...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined mr-2">send</span>
                          상담 신청하기
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* 운영 시간 안내 */}
          <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                <span className="material-symbols-outlined">schedule</span>
                운영 시간
              </h3>
              <p className="text-blue-600 dark:text-blue-400 mb-2">
                평일: 14:00 ~ 19:00<br />
                토요일: 14:00 ~ 17:00<br />
                일요일 및 공휴일: 휴무
              </p>
              <p className="text-sm text-blue-500 dark:text-blue-500">
                ※ 운영 시간 외 문의는 온라인 상담 신청을 이용해주세요.
              </p>
            </CardContent>
          </Card>

          {/* 기타 안내 */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              더 자세한 정보가 필요하신가요?
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/about">
                <Button variant="outline">학원 소개</Button>
              </Link>
              <Link href="/curriculum">
                <Button variant="outline">커리큘럼 안내</Button>
              </Link>
              <Link href="/location">
                <Button variant="outline">오시는 길</Button>
              </Link>
            </div>
          </div>
          </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
