"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { api, endpoints } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { AcademyInfo, ApiResponse } from "@/types/api";

export default function AboutPage() {
  const [academyInfo, setAcademyInfo] = useState<AcademyInfo | null>(null);

  const fetchAcademyInfo = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<AcademyInfo>>(endpoints.academy.info);
      if (response.success && response.data) {
        setAcademyInfo(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch academy info:", error);
    }
  }, []);

  useEffect(() => {
    fetchAcademyInfo();
  }, [fetchAcademyInfo]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-6">
              <span className="material-symbols-outlined text-base">info</span>
              학원 소개
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl mb-6">
              미래를 코딩하다, <span className="text-primary">코딩메이커학원</span>
            </h1>
            <p className="text-lg text-secondary mb-8 max-w-3xl mx-auto">
              광양의 IT 교육 거점, 23년 경력 임베디드 전문가와 20년 경력 웹툰 작가가 이끄는 실무 중심 교육
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/curriculum">
                <Button size="lg">
                  커리큘럼 보기
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  상담 신청
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">학원 소개</h2>
          
          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4 text-primary">교육 철학</h3>
              <p className="text-lg leading-relaxed text-muted-foreground mb-6">
                코딩메이커학원은 <strong className="text-foreground">메이커 교육</strong>과 <strong className="text-foreground">실무 중심 코딩</strong>을 
                통해 학생들이 직접 만들고 경험하며 배우는 교육을 지향합니다. 단순한 이론 학습을 넘어, 
                실제 프로젝트를 통해 창의력과 문제 해결 능력을 키웁니다.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                광양 지역 내 대표적인 IT/디지털 교육기관으로서, 임베디드/코딩부터 웹툰/창작, 
                자격증 과정까지 다원화된 커리큘럼을 제공하여 학생과 성인, 직장인 모두가 
                자신의 목표에 맞는 교육을 받을 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* 기본 정보 */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                  <div>
                    <h3 className="font-bold mb-2">주소</h3>
                    <p className="text-muted-foreground">
                      {academyInfo?.address || "전남 광양시 무등길 47 (중동 1549-9)"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">phone</span>
                  <div>
                    <h3 className="font-bold mb-2">연락처</h3>
                    <p className="text-muted-foreground">
                      {academyInfo?.phone || "061-745-3355"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">schedule</span>
                  <div>
                    <h3 className="font-bold mb-2">운영 시간</h3>
                    <p className="text-muted-foreground">
                      {academyInfo?.hours || "평일 14:00~19:00 / 토 14:00~17:00"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-3xl">language</span>
                  <div>
                    <h3 className="font-bold mb-2">SNS</h3>
                    <div className="space-y-1">
                      <a 
                        href={academyInfo?.blog || "https://blog.naver.com/kkj0201"} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary hover:underline"
                      >
                        네이버 블로그
                      </a>
                      <a 
                        href={`https://www.instagram.com/${academyInfo?.instagram || "codingmaker_kj"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-primary hover:underline"
                      >
                        Instagram
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 강사진 */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">전문 강사진</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-bold text-lg mb-2">임베디드 전문가</h4>
                  <p className="text-muted-foreground mb-2">23년 경력</p>
                  <p className="text-sm">
                    C언어, 임베디드 프로그래밍, 회로이론, 기초전자, 임베디드 시스템을 
                    실무 중심으로 교육합니다.
                  </p>
                </div>
                <div className="border-l-4 border-orange-500 pl-4">
                  <h4 className="font-bold text-lg mb-2">웹툰 작가</h4>
                  <p className="text-muted-foreground mb-2">20년 경력</p>
                  <p className="text-sm">
                    웹툰, 인스타툰, 3D 프린터 모델링, 클립스튜디오, 스케치업 등 
                    창작 과정을 지도합니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 시설 및 환경 */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">시설 및 환경</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  <div>
                    <h4 className="font-bold mb-1">최신 장비</h4>
                    <p className="text-sm text-muted-foreground">
                      다수의 고성능 컴퓨터와 실습 장비 보유
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  <div>
                    <h4 className="font-bold mb-1">쾌적한 환경</h4>
                    <p className="text-sm text-muted-foreground">
                      실무 실습에 최적화된 쾌적한 공간
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  <div>
                    <h4 className="font-bold mb-1">소규모 클래스</h4>
                    <p className="text-sm text-muted-foreground">
                      5~9명의 소규모 인원으로 밀착 지도
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-green-600">check_circle</span>
                  <div>
                    <h4 className="font-bold mb-1">실습 중심</h4>
                    <p className="text-sm text-muted-foreground">
                      전자기기, 3D 프린터 등 다양한 실습 도구 구비
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 후기 및 평가 */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-6 text-primary">후기 및 평가</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">5.0</div>
                  <div className="text-sm text-muted-foreground">강사진의 강의력</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">5.0</div>
                  <div className="text-sm text-muted-foreground">시설·환경</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">학생 추천율</div>
                </div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm italic">
                  "컴퓨터 시설이 우수하며, 자기주도형 학습 문화가 강점입니다. 
                  스스로 공부하는 분위기에서 실력을 키울 수 있습니다."
                </p>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center py-8">
            <h3 className="text-2xl font-bold mb-4">지금 바로 시작하세요!</h3>
            <p className="text-muted-foreground mb-6">
              상담 신청을 통해 나에게 맞는 과정을 찾아보세요.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/curriculum">
                <Button size="lg">커리큘럼 보기</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">상담 신청</Button>
              </Link>
            </div>
          </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
