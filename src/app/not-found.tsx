import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-black text-foreground sm:text-8xl">404</h1>
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었습니다.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <span className="material-symbols-outlined text-base">home</span>
              홈으로 돌아가기
            </Button>
          </Link>
          <Link href="/auth">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              로그인
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
