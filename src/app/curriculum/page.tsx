"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function CurriculumPage() {
  const courses = [
    {
      id: 1,
      category: "코딩/임베디드",
      title: "임베디드 전문가 과정",
      color: "blue",
      description: "C언어부터 임베디드 시스템까지 실무 중심 교육",
      subjects: [
        "C언어 기초 및 고급",
        "임베디드 프로그래밍",
        "회로이론",
        "기초전자",
        "임베디드 시스템 설계"
      ],
      target: "중학생 ~ 성인, 직장인",
      features: [
        "임베디드 전문가 23년 경력 강사 직접 교육",
        "실무·실습형 교육",
        "소규모·야간/주말반 운영",
        "개인 맞춤형 커리큘럼"
      ],
      price: "150,000원 / 1,000분",
      duration: "장기 과정 (24개월 이상 가능)",
      level: "초급 ~ 고급"
    },
    {
      id: 2,
      category: "창작 메이커",
      title: "웹툰·디지털 창작 과정",
      color: "orange",
      description: "웹툰 작가와 함께하는 실전 창작 교육",
      subjects: [
        "웹툰·인스타툰 제작",
        "3D 프린터 모델링",
        "클립스튜디오",
        "스케치업",
        "디지털 창작 기법"
      ],
      target: "초등학생 ~ 성인, 직장인",
      features: [
        "웹툰 작가 20년 경력 강사 초빙",
        "실무 중심 창작 과정",
        "포트폴리오 제작 지원",
        "작품 전시 기회 제공"
      ],
      price: "170,000원 / 1,000분",
      duration: "장기 과정 (유연한 기간 설정)",
      level: "초급 ~ 고급"
    },
    {
      id: 3,
      category: "자격증 특강",
      title: "컴퓨터활용능력 2급 실기",
      color: "green",
      description: "단기 집중 특강으로 자격증 취득",
      subjects: [
        "스프레드시트 실무",
        "함수 활용",
        "데이터 분석",
        "차트 작성",
        "실기 문제 풀이"
      ],
      target: "고등학생 ~ 성인",
      features: [
        "약 4주 과정 (8회 실습)",
        "선착순 모집",
        "실기 연습 집중",
        "합격률 높은 커리큘럼"
      ],
      price: "약 180,000원 / 8회",
      duration: "단기 (약 4주)",
      level: "중급",
      special: "개별 재료비 발생"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 border-blue-200 dark:border-blue-800",
      orange: "from-orange-500 to-orange-600 border-orange-200 dark:border-orange-800",
      green: "from-green-500 to-green-600 border-green-200 dark:border-green-800"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">커리큘럼 안내</h1>
          <p className="text-xl">다양한 과정으로 당신의 목표를 이루세요</p>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">3가지 전문 과정</h2>
          <p className="text-muted-foreground text-lg">
            코딩메이커학원은 임베디드/코딩, 창작 메이커, 자격증 과정을 운영하며,
            <br />모든 과정은 전문가 강사진이 직접 진행합니다.
          </p>
        </div>

        {/* Courses */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {courses.map((course, index) => (
            <Card key={course.id} className={`border-2 ${getColorClasses(course.color)}`}>
              <CardHeader className={`bg-gradient-to-r ${getColorClasses(course.color)} text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold mb-2 opacity-90">{course.category}</div>
                    <CardTitle className="text-2xl mb-2">{course.title}</CardTitle>
                    <p className="text-sm opacity-90">{course.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm opacity-90">난이도</div>
                    <div className="font-bold">{course.level}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">menu_book</span>
                      주요 과목
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {course.subjects.map((subject, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="material-symbols-outlined text-green-600 text-base mt-0.5">check_circle</span>
                          {subject}
                        </li>
                      ))}
                    </ul>

                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">people</span>
                      대상
                    </h4>
                    <p className="text-sm text-muted-foreground mb-4">{course.target}</p>
                  </div>

                  {/* Right Column */}
                  <div>
                    <h4 className="font-bold mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">star</span>
                      특징
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {course.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="material-symbols-outlined text-blue-600 text-base mt-0.5">arrow_forward</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="bg-muted p-4 rounded-lg space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">수강료</span>
                        <span className="text-lg font-bold text-primary">{course.price}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">기간</span>
                        <span className="text-sm">{course.duration}</span>
                      </div>
                      {course.special && (
                        <div className="pt-2 border-t text-xs text-amber-600 dark:text-amber-400">
                          ※ {course.special}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t flex justify-end">
                  <Link href="/contact">
                    <Button>
                      <span className="material-symbols-outlined mr-2">calendar_today</span>
                      상담 신청하기
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <Card className="mt-12 max-w-4xl mx-auto">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4">수강 안내</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2 text-primary">✓ 소규모 클래스</h4>
                <p className="text-muted-foreground">
                  5~9명의 소규모 인원으로 개인별 맞춤 지도
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">✓ 실습 중심</h4>
                <p className="text-muted-foreground">
                  이론보다 실습에 집중한 실무형 커리큘럼
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">✓ 유연한 스케줄</h4>
                <p className="text-muted-foreground">
                  주중·야간·주말반 운영으로 직장인도 수강 가능
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">✓ 전문가 강사진</h4>
                <p className="text-muted-foreground">
                  20년 이상 경력의 전문가가 직접 지도
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center py-12">
          <h3 className="text-2xl font-bold mb-4">궁금한 점이 있으신가요?</h3>
          <p className="text-muted-foreground mb-6">
            상담을 통해 나에게 맞는 과정을 추천받으세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                <span className="material-symbols-outlined mr-2">chat</span>
                상담 신청
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">학원 소개 보기</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
