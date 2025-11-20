"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function SiteInfoPage() {
  const techStack = {
    frontend: [
      { name: "Next.js 14", desc: "App Router를 활용한 서버 사이드 렌더링", icon: "bolt" },
      { name: "React 18", desc: "최신 React 기능 활용", icon: "science" },
      { name: "TypeScript", desc: "타입 안정성 보장", icon: "code" },
      { name: "Tailwind CSS", desc: "유틸리티 퍼스트 스타일링", icon: "palette" },
      { name: "shadcn/ui", desc: "재사용 가능한 컴포넌트", icon: "widgets" },
    ],
    backend: [
      { name: "Express.js", desc: "Node.js 백엔드 프레임워크", icon: "dns" },
      { name: "Prisma ORM", desc: "타입 안전 데이터베이스 ORM", icon: "storage" },
      { name: "Socket.io", desc: "실시간 양방향 통신", icon: "sync_alt" },
      { name: "JWT", desc: "안전한 인증 시스템", icon: "verified_user" },
      { name: "AES-256", desc: "Random IV 암호화", icon: "lock" },
    ],
    database: [
      { name: "SQLite", desc: "개발 환경 데이터베이스", icon: "database" },
      { name: "MySQL", desc: "프로덕션 환경 준비", icon: "cloud_upload" },
    ],
    features: [
      { name: "Tier 권한 시스템", desc: "5단계 사용자 권한 관리", icon: "admin_panel_settings" },
      { name: "실시간 채팅", desc: "Socket.io 기반 채팅", icon: "chat" },
      { name: "출석 시스템", desc: "태그 기반 출석 체크", icon: "how_to_reg" },
      { name: "통계 대시보드", desc: "Tier 1,2 전용 통계", icon: "analytics" },
      { name: "CMS", desc: "동적 콘텐츠 관리", icon: "edit_note" },
      { name: "반응형 디자인", desc: "모든 기기 대응", icon: "devices" },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-6">
              <span className="material-symbols-outlined text-base">code</span>
              사이트 정보
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl mb-6">
              최신 기술로 <span className="text-primary">구축된</span> 학원 관리 플랫폼
            </h1>
            <p className="text-lg text-secondary mb-8 max-w-3xl mx-auto">
              코딩메이커 학원 통합 관리 시스템 (CMLMS)
            </p>
          </div>
        </section>

        {/* 프로젝트 개요 */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-12 border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="text-3xl flex items-center gap-3">
                <span className="material-symbols-outlined text-4xl text-primary">info</span>
                프로젝트 개요
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">프로젝트명</h3>
                <p className="text-lg">코딩메이커 학원 통합 관리 시스템 (CMLMS)</p>
                <p className="text-sm text-muted-foreground">Coding Maker Academy Learning Management System</p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">개발 목적</h3>
                <p className="text-muted-foreground leading-relaxed">
                  광양시에 위치한 코딩메이커학원의 운영 효율화와 교육 서비스 고도화를 위한 
                  올인원(All-in-One) 플랫폼입니다. 임베디드/코딩, 웹툰/창작, 자격증 과정 등 
                  다원화된 커리큘럼을 체계적으로 관리하고, 학생과 학부모, 강사 간의 
                  유기적인 소통을 지원합니다.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3 text-primary">핵심 가치</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <span className="material-symbols-outlined text-3xl text-blue-600 mb-2 block">shield</span>
                    <h4 className="font-bold mb-1">보안</h4>
                    <p className="text-sm text-muted-foreground">AES-256 Random IV 암호화로 개인정보 보호</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <span className="material-symbols-outlined text-3xl text-green-600 mb-2 block">speed</span>
                    <h4 className="font-bold mb-1">실시간</h4>
                    <p className="text-sm text-muted-foreground">Socket.io 기반 실시간 통신</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                    <span className="material-symbols-outlined text-3xl text-orange-600 mb-2 block">tune</span>
                    <h4 className="font-bold mb-1">유연성</h4>
                    <p className="text-sm text-muted-foreground">동적 CMS로 관리 편의성 극대화</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 기술 스택 */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                사용 기술
              </span>
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Frontend */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
                  <CardTitle className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">web</span>
                    Frontend
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {techStack.frontend.map((tech, idx) => (
                      <div 
                        key={tech.name} 
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <span className="material-symbols-outlined text-primary">{tech.icon}</span>
                        <div>
                          <h4 className="font-bold">{tech.name}</h4>
                          <p className="text-sm text-muted-foreground">{tech.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Backend */}
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10">
                  <CardTitle className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">dns</span>
                    Backend
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {techStack.backend.map((tech, idx) => (
                      <div 
                        key={tech.name} 
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                        style={{ animationDelay: `${idx * 100}ms` }}
                      >
                        <span className="material-symbols-outlined text-primary">{tech.icon}</span>
                        <div>
                          <h4 className="font-bold">{tech.name}</h4>
                          <p className="text-sm text-muted-foreground">{tech.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Database */}
            <Card className="mt-8 hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                <CardTitle className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-purple-600">storage</span>
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {techStack.database.map((tech) => (
                    <div key={tech.name} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted transition-colors">
                      <span className="material-symbols-outlined text-primary">{tech.icon}</span>
                      <div>
                        <h4 className="font-bold">{tech.name}</h4>
                        <p className="text-sm text-muted-foreground">{tech.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 주요 기능 */}
          <Card className="mb-12">
            <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span className="material-symbols-outlined text-orange-600">star</span>
                주요 기능
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-4">
                {techStack.features.map((feature, idx) => (
                  <div 
                    key={feature.name}
                    className="p-4 border rounded-lg hover:border-primary hover:shadow-md transition-all duration-300 cursor-pointer group"
                  >
                    <span className="material-symbols-outlined text-3xl text-primary mb-2 block group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </span>
                    <h4 className="font-bold mb-1">{feature.name}</h4>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 제작자 정보 */}
          <Card className="mb-12 border-2 border-primary/30">
            <CardHeader className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <span className="material-symbols-outlined">person</span>
                제작자 소개
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
                  김
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">김현민</h3>
                  <div className="space-y-2 text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">school</span>
                      대학교 2학년 재학 중 (2003년생)
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">emoji_events</span>
                      코딩메이커학원 제 1호 수강생
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">code</span>
                      Full-Stack Developer
                    </p>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <p className="text-sm italic">
                      "코딩메이커학원에서 배운 실무 중심 교육을 바탕으로 학원의 디지털 전환을 
                      돕고자 이 시스템을 개발하게 되었습니다. 학원의 첫 번째 수강생으로서 
                      더 많은 학생들이 효율적으로 배울 수 있는 환경을 만들고 싶었습니다."
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 통계 */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: "API 엔드포인트", value: "33", icon: "api" },
              { label: "페이지", value: "23", icon: "web_asset" },
              { label: "컴포넌트", value: "50+", icon: "widgets" },
              { label: "완성도", value: "100%", icon: "check_circle" },
            ].map((stat, idx) => (
              <Card key={stat.label} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <span className="material-symbols-outlined text-5xl text-primary mb-2 block">
                    {stat.icon}
                  </span>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-2xl">
            <h3 className="text-2xl font-bold mb-4">더 자세한 정보가 필요하신가요?</h3>
            <p className="text-muted-foreground mb-6">
              프로젝트 문서 및 소스코드를 확인하시거나 학원에 문의하세요.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/about">
                <Button size="lg" className="gap-2">
                  <span className="material-symbols-outlined">school</span>
                  학원 소개
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="gap-2">
                  <span className="material-symbols-outlined">chat</span>
                  문의하기
                </Button>
              </Link>
            </div>
          </div>
          </div>
          </div>
        </section>
      </main>
      <Footer />

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        
        .animation-delay-100 {
          animation-delay: 0.1s;
        }
      `}</style>
    </div>
  );
}
