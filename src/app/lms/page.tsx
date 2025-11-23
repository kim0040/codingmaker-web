"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { curriculumList, exampleCode } from "@/data/lms";
import { studentSidebar } from "@/data/student";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { 
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-muted animate-pulse rounded-xl">
    <p className="text-muted-foreground">에디터 로딩 중...</p>
  </div>
});

const LANGUAGES = [
  { label: "Python", value: "python" },
  { label: "C", value: "c" },
];

declare global {
  interface Window {
    __monacoErrorPatched?: boolean;
  }
}

if (typeof window !== "undefined" && !window.__monacoErrorPatched) {
  const originalConsoleError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Canceled")) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
  window.__monacoErrorPatched = true;
}

export default function LmsPage() {
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]["value"]>("python");
  const [studentCode, setStudentCode] = useState("# 과제를 작성해 보세요\n");
  const { theme } = useTheme();
  const editorTheme = theme === "dark" ? "vs-dark" : "light";
  const editorRef = useRef<any>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;

        if (editorRef.current) {
          try {
            editorRef.current.dispose?.();
          } catch {
            // 정리 중 에러 무시
          }
        }
      };
    }, []);

    const handleEditorWillMount = (monaco: any) => {
      if (!isMountedRef.current) return;
      try {
        monaco.editor.defineTheme('custom-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [],
          colors: {}
        });
      } catch {
        // 에러 무시
      }
    };

    const handleEditorDidMount = (editor: any, _monaco: any) => {
      if (!isMountedRef.current) return;
      editorRef.current = editor;
      try {
        editor.updateOptions({
          fontSize: 14,
          lineHeight: 21,
          padding: { top: 10, bottom: 10 }
        });
      } catch {
        // 에디터 초기화 중 취소된 경우 무시
      }
    };

  const handleSave = () => {
    console.log('임시 저장된 코드:', studentCode);
    alert('코드가 임시 저장되었습니다!');
  };

  const handleSubmit = () => {
    if (!studentCode.trim() || studentCode === "# 과제를 작성해 보세요\n") {
      alert('코드를 작성해주세요.');
      return;
    }
    console.log('제출된 코드:', studentCode);
    alert('과제가 제출되었습니다!');
  };

  return (
    <DashboardLayout
      userName="김코딩"
      userSubtitle="LMS 강의실"
      sidebarItems={studentSidebar}
      bottomNavItems={[
        studentSidebar[0], // 대시보드
        studentSidebar[1], // 내 클래스
        studentSidebar[2], // 프로젝트
        studentSidebar[3], // LMS 강의실
        studentSidebar[5], // 채팅
      ]}
      headerTitle="LMS 강의실"
      headerSubtitle="커리큘럼과 코드를 함께 확인하세요"
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="text-xl font-bold text-foreground">커리큘럼</h2>
          <p className="text-sm text-muted-foreground">주차별 학습 진행 상태</p>
          <div className="mt-4 space-y-4">
              {curriculumList.map((step) => (
                <div key={step.title} className="flex items-start gap-3">
                <div
                  className={`flex size-8 items-center justify-center rounded-full border text-sm font-semibold ${
                    step.status === "completed"
                      ? "border-secondary bg-secondary text-white"
                      : step.status === "in-progress"
                      ? "border-primary bg-primary text-white"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step.status === "completed" ? (
                    <span className="material-symbols-outlined text-base">check</span>
                  ) : step.status === "in-progress" ? (
                    <span className="material-symbols-outlined text-base">play_arrow</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">lock</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {step.title}
                    {step.status === "in-progress" && (
                      <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">진행 중</span>
                    )}
                  </p>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-foreground">예제 코드</h3>
                <p className="text-sm text-muted-foreground">강사 제공 예제를 참고하세요</p>
              </div>
              <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                  <Button
                    key={lang.value}
                    variant={language === lang.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage(lang.value)}
                  >
                    {lang.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <MonacoEditor
                height="240px"
                language={language === "python" ? "python" : "c"}
                value={exampleCode[language as keyof typeof exampleCode]}
                options={{ readOnly: true, minimap: { enabled: false } }}
                theme={editorTheme}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">내 코드 작성</h3>
                <p className="text-sm text-muted-foreground">과제를 작성하고 제출하세요</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSave}>
                  임시 저장
                </Button>
                <Button size="sm" onClick={handleSubmit}>제출하기</Button>
              </div>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <MonacoEditor
                height="320px"
                language={language === "python" ? "python" : "c"}
                value={studentCode}
                onChange={(val) => setStudentCode(val ?? "")}
                options={{ minimap: { enabled: false } }}
                theme={editorTheme}
                beforeMount={handleEditorWillMount}
                onMount={handleEditorDidMount}
              />
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
