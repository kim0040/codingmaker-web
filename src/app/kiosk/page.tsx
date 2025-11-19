"use client";

import { useMemo, useState } from "react";
import { kioskMeta, kioskKeyboard } from "@/data/kiosk";
import { Button } from "@/components/ui/button";

const DUPLICATE_RESULTS = [
  "홍길동A (중등반)",
  "홍길동B (고등반)",
];

export default function KioskPage() {
  const [value, setValue] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDuplicate, setShowDuplicate] = useState(false);

  const displayValue = useMemo(() => {
    if (!value) return "";
    // 마지막 4자리만 보여주기
    const visible = value.slice(-4);
    const masked = value.length > 4 ? "*".repeat(value.length - 4) : "";
    return masked + visible;
  }, [value]);

  const handleKey = (key: string) => {
    if (key === "Clear") {
      setValue("");
      setShowSuccess(false);
      setShowDuplicate(false);
      return;
    }
    if (key === "backspace") {
      setValue((prev) => prev.slice(0, -1));
      return;
    }
    setValue((prev) => `${prev}${key}`);
  };

  const handleSubmit = () => {
    if (!value) return;
    if (value.startsWith("홍길동")) {
      setShowDuplicate(true);
      setShowSuccess(false);
    } else {
      setShowSuccess(true);
      setShowDuplicate(false);
      // TODO: 성공 효과음 재생 로직 위치
      // playSuccessSound();
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-3xl space-y-8 text-center">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">출석체크 키오스크</p>
            <h1 className="mt-4 text-4xl font-bold text-foreground">{kioskMeta.instruction}</h1>
            <p className="mt-2 text-primary">현재 시각 {kioskMeta.timeDisplay}</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border-4 border-primary/20 bg-card p-8 shadow-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">휴대폰 뒤 4자리</p>
              <div className="min-h-[80px] flex items-center justify-center">
                <p className="text-5xl sm:text-6xl font-bold tracking-[0.5em] text-foreground">
                  {value || <span className="text-muted-foreground text-3xl">숫자 4자리를 입력하세요</span>}
                </p>
              </div>
              {value && value.length === 4 && (
                <p className="mt-4 text-sm text-green-600 font-semibold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-base">check_circle</span>
                  입력 완료! 출석하기 버튼을 눌러주세요
                </p>
              )}
            </div>
          </div>

          <div className="rounded-3xl bg-card border border-border p-8 shadow-xl max-w-md mx-auto">
            <div className="grid gap-4">
              {kioskKeyboard.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${row.length}, 1fr)` }}>
                  {row.map((key) => (
                    <button
                      key={key}
                      onClick={() => handleKey(key)}
                      disabled={value.length >= 4 && key !== "Clear" && key !== "backspace"}
                      className={`h-20 rounded-2xl font-bold text-3xl transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                        key === "Clear" 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : key === "backspace"
                          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                          : "bg-primary hover:bg-primary/90 text-white"
                      }`}
                    >
                      {key === "backspace" ? (
                        <span className="material-symbols-outlined text-4xl">backspace</span>
                      ) : (
                        key
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              disabled={value.length !== 4}
              className="h-20 w-full max-w-md rounded-2xl text-2xl font-bold shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
            >
              <span className="material-symbols-outlined text-3xl mr-2">check_circle</span>
              {kioskMeta.buttonLabel}
            </Button>
          </div>
        </div>
      </main>

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-3xl bg-card p-8 text-center text-foreground shadow-2xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success text-white">
              <span className="material-symbols-outlined !text-4xl">task_alt</span>
            </div>
            <h2 className="mt-6 text-3xl font-bold">출석 완료!</h2>
            <p className="mt-2 text-muted-foreground">입력이 확인되었습니다. 잠시 후 화면이 초기화됩니다.</p>
          </div>
        </div>
      )}

      {showDuplicate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md rounded-3xl bg-card p-6 text-foreground shadow-2xl">
            <h2 className="text-2xl font-bold">동명이인이 있습니다</h2>
            <p className="mt-2 text-muted-foreground">아래에서 본인을 선택해 주세요.</p>
            <div className="mt-4 space-y-3">
              {DUPLICATE_RESULTS.map((name) => (
                <button
                  key={name}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-left text-lg font-semibold hover:border-primary"
                  onClick={() => {
                    setShowDuplicate(false);
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 3000);
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
