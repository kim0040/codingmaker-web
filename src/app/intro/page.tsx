"use client";

import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { academyProfile, heroStats, summaryHighlights, consultationChannels } from "@/data/academy";

const experienceMilestones = [
  {
    title: "학원 비전",
    description: "광양 대표 IT·메이커 교육기관으로 학생과 직장인의 성장 동반",
    icon: "rocket_launch",
  },
  {
    title: "교육 방식",
    description: "실무 장비와 프로젝트 기반으로 이루어진 체험형 학습",
    icon: "precision_manufacturing",
  },
  {
    title: "상담 경험",
    description: "구글폼·블로그 기반으로 맞춤형 상담과 커리큘럼 제안",
    icon: "forum",
  },
];

const creatorHighlight = {
  name: "김현민",
  bio: "2003년생, 대학교 2학년. 코딩메이커학원 최초 수강생 출신으로 학원의 디지털 운영 고도화를 위해 플랫폼을 직접 개발했습니다.",
  note: "학원에서 시작한 배움을 토대로 실무 역량을 키워, 후배 학습자들에게 더 나은 경험을 제공하고자 합니다.",
};

export default function IntroPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-background">
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div className="space-y-5 fade-in">
                <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
                  메인 소개 상세
                </p>
                <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
                  광양 지역을 대표하는 <span className="text-primary">실무형 IT·메이커</span> 학원
                </h1>
                <p className="text-lg text-secondary leading-relaxed">
                  {academyProfile.description} 최신 장비와 전문가 멘토링을 바탕으로 프로젝트를 완성하며, 학생·학부모가 신뢰하는 교육 서비스를 제공합니다.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/contact">
                    <Button size="lg" className="px-6 gap-2">
                      <span className="material-symbols-outlined text-base">calendar_add_on</span>
                      상담 예약하기
                    </Button>
                  </Link>
                  <Link href={consultationChannels[0].link} target="_blank">
                    <Button size="lg" variant="outline" className="px-6 gap-2">
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                      네이버 블로그
                    </Button>
                  </Link>
                </div>
              </div>
              <Card className="border-none bg-card shadow-lg slide-up">
                <CardHeader className="pb-2">
                  <CardTitle className="text-2xl">한눈에 보는 핵심 지표</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                  {heroStats.map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-2xl border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <p className="text-xs font-semibold text-primary">{stat.label}</p>
                      <p className="text-3xl font-black text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.helper}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-background py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center fade-in">
              <p className="text-sm font-semibold text-primary">WHY CODINGMAKER</p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">학원의 강점을 깊이 있게 살펴보세요</h2>
              <p className="text-secondary mt-2">메인 페이지에서 본 포인트를 더 풍부한 사례와 경험으로 풀어냈습니다.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
              <div className="space-y-4">
                {summaryHighlights.map((item, idx) => (
                  <Card
                    key={item.title}
                    className="border-border/70 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md slide-up"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    <CardContent className="flex items-start gap-3 p-6">
                      <span className="material-symbols-outlined text-primary">workspace_premium</span>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="border-primary/20 bg-primary/5 shadow-inner slide-up">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined">sparkles</span>
                    학습 경험 플로우
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {experienceMilestones.map((milestone, idx) => (
                    <div
                      key={milestone.title}
                      className="rounded-xl bg-background p-4 shadow-sm ring-1 ring-border/60 transition hover:ring-primary/60"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <div className="flex items-center gap-2 text-primary">
                        <span className="material-symbols-outlined text-lg">{milestone.icon}</span>
                        <p className="text-sm font-semibold">{milestone.title}</p>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Card className="border-2 border-primary/20 shadow-lg slide-up">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/20">
                <CardTitle className="flex items-center gap-2 text-2xl text-primary">
                  <span className="material-symbols-outlined">handshake</span>
                  상담/문의 안내
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <p className="text-muted-foreground leading-relaxed">
                  상담 채널별로 원하는 과정을 선택하고 바로 문의를 남길 수 있습니다. 맞춤 상담 후 등록까지 빠르게 진행해 보세요.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {consultationChannels.map((channel) => (
                    <Link key={channel.label} href={channel.link} target="_blank">
                      <div className="flex h-full flex-col justify-between rounded-xl border border-border/70 bg-background p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                        <div className="flex items-center gap-2 text-primary">
                          <span className="material-symbols-outlined text-base">open_in_new</span>
                          <p className="text-sm font-semibold">{channel.label}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{channel.detail}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/location">
                    <Button variant="secondary" className="gap-2">
                      <span className="material-symbols-outlined text-base">location_on</span>
                      오시는 길 안내
                    </Button>
                  </Link>
                  <Link href="/curriculum">
                    <Button variant="outline" className="gap-2">
                      <span className="material-symbols-outlined text-base">menu_book</span>
                      커리큘럼 살펴보기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card shadow-lg slide-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <span className="material-symbols-outlined text-primary">emoji_objects</span>
                  제작자 & 사이트 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-background p-4 shadow-sm">
                  <p className="text-sm font-semibold text-primary">이 사이트를 만든 사람</p>
                  <h3 className="text-xl font-bold text-foreground mt-1">{creatorHighlight.name}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2">{creatorHighlight.bio}</p>
                  <p className="mt-3 rounded-lg bg-primary/5 p-3 text-sm text-secondary">{creatorHighlight.note}</p>
                </div>
                <div className="rounded-xl border border-primary/40 bg-primary/5 p-4">
                  <p className="text-sm font-semibold text-primary">홈페이지 기술 스택</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Next.js, TypeScript, Tailwind CSS, shadcn/ui, Socket.io, Express, Prisma 등 최신 웹 기술을 활용해 학원 운영을 통합 관리합니다.
                  </p>
                  <Link href="/site-info" className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                    자세히 보기
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.6s ease-out; }
        .slide-up { animation: fadeIn 0.7s ease-out; }
      `}</style>
    </div>
  );
}
