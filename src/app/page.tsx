import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  academyProfile,
  heroStats,
  courseTracks,
  summaryHighlights,
  consultationChannels,
} from "@/data/academy";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-background">
        <section id="about" className="relative overflow-hidden bg-gradient-to-b from-background to-muted">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
            <div className="space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                <span className="material-symbols-outlined text-base">military_tech</span>
                광양 대표 IT·메이커 전문 학원
              </p>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">
                미래를 코딩하다, <span className="text-primary">코딩메이커학원</span>
              </h1>
              <p className="text-lg text-secondary">
                23년 경력 임베디드 전문가와 20년 경력 웹툰 작가가 이끄는 실무 중심 커리큘럼. 소수 정예·맞춤형 상담으로 학생부터 직장인까지 모두 성장합니다.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact">
                  <Button size="lg" className="px-6">
                    상담 신청하기
                  </Button>
                </Link>
                <Link href="/intro">
                  <Button size="lg" variant="secondary" className="px-6">
                    <span className="material-symbols-outlined text-base">explore</span>
                    상세 소개 보기
                  </Button>
                </Link>
                <a href={`tel:${academyProfile.phone.replace(/-/g, '')}`}>
                  <Button size="lg" variant="ghost" className="px-6">
                    <span className="material-symbols-outlined text-base">call</span>
                    {academyProfile.phone}
                  </Button>
                </a>
              </div>
              <div className="grid gap-6 rounded-2xl border border-border bg-card/80 p-6 shadow-sm">
                <div className="flex flex-wrap justify-between gap-4 text-sm text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground">상담 가능 시간</p>
                    <p>{academyProfile.hours}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">주소</p>
                    <p>{academyProfile.address}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 shadow-lg sm:grid-cols-2">
              {heroStats.map((stat) => (
                <Card key={stat.label} className="border-none bg-primary/5">
                  <CardHeader className="p-4">
                    <CardDescription className="text-sm text-secondary">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-3xl text-primary">{stat.value}</CardTitle>
                    <p className="text-xs text-secondary">{stat.helper}</p>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="courses" className="bg-muted py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
            <div className="space-y-3 text-center">
              <p className="text-sm font-semibold text-primary">COURSE TRACKS</p>
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                맞춤형 커리큘럼으로 실무 역량 강화
              </h2>
              <p className="text-secondary">
                {academyProfile.summary}
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courseTracks.map((course) => (
                <Card key={course.title} className="h-full border-border/60 bg-background">
                  <CardHeader>
                    <CardTitle className="text-xl">{course.title}</CardTitle>
                    <CardDescription>
                      {course.subjects.join(" · ")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary">groups</span>
                      <div>
                        <p className="text-muted-foreground">대상</p>
                        <p className="font-semibold text-foreground">{course.target}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary">payments</span>
                      <div>
                        <p className="text-muted-foreground">강습비</p>
                        <p className="font-semibold text-foreground">{course.price}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-primary">task_alt</span>
                      <p className="text-muted-foreground">
                        {course.features.join(" · ")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="highlights" className="bg-background py-16">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
            <div className="space-y-4">
              <p className="text-sm font-semibold text-primary">WHY CODINGMAKER</p>
              <h2 className="text-3xl font-bold text-foreground">
                학생·학부모가 선정한 광양 대표 IT 교육 기관
              </h2>
              <ul className="space-y-3 text-secondary">
                {summaryHighlights.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary">
                      workspace_premium
                    </span>
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p>{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <Card id="contact" className="border-none bg-card shadow-md">
              <CardHeader>
                <CardTitle className="text-2xl">상담/신청 안내</CardTitle>
                <CardDescription>
                  네이버 블로그 혹은 구글폼을 통해 과정을 선택하고 상담을 신청하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="rounded-lg bg-primary/5 p-4">
                  <p className="font-semibold text-primary">신청 채널</p>
                  <p>네이버 블로그 · 구글폼 상담신청서</p>
                </div>
                <div className="rounded-lg bg-muted p-4">
                  <p className="font-semibold text-foreground">실습 과정 유의사항</p>
                  <p className="text-muted-foreground">
                    전자기기·3D 프린터 등 재료비가 과정별로 추가될 수 있습니다.
                  </p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <p className="font-semibold text-foreground">기타 안내</p>
                  <p className="text-muted-foreground">
                    공공데이터 기반으로 정보가 관리되며, 학원 정보 변경은 관리자 등록 또는 교육청 신고로 처리됩니다.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href={consultationChannels[0].link}
                    target="_blank"
                    className="flex-1"
                  >
                    <Button variant="secondary" className="w-full">
                      {consultationChannels[0].label} 바로가기
                    </Button>
                  </Link>
                  <Link
                    href={consultationChannels[2].link}
                    target="_blank"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full">
                      구글폼 신청서
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="bg-gradient-to-r from-primary/5 via-background to-primary/5 py-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-2 text-center">
              <p className="text-sm font-semibold text-primary">SITE INFO</p>
              <h3 className="text-2xl font-bold text-foreground">홈페이지와 제작자에 대해 더 알아보기</h3>
              <p className="text-secondary">
                사용된 기술 스택과 제작 배경, 학원의 첫 번째 수강생인 김현민의 이야기를 확인하세요.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-[2fr_1fr]">
              <Card className="border-border/60 bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined">emoji_objects</span>
                    사이트 하이라이트
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 sm:grid-cols-2 text-sm text-muted-foreground">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-semibold text-foreground">기술 스택</p>
                    <p>Next.js · TypeScript · Tailwind CSS · Socket.io</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="font-semibold text-foreground">제작자</p>
                    <p>2003년생, 대학교 2학년 김현민 (학원 첫 수강생)</p>
                  </div>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm text-foreground shadow-sm">
                <p className="font-semibold text-primary">더 깊이 보기</p>
                <p className="text-muted-foreground">
                  사이트 정보 페이지에서 사용된 기술과 기능, 제작 스토리를 자세히 확인할 수 있습니다.
                </p>
                <Link href="/site-info" className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition hover:shadow-md">
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                  사이트 정보로 이동
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
