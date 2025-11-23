"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { api, endpoints } from "@/lib/api";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import type { AcademyInfo, ApiResponse } from "@/types/api";

export default function LocationPage() {
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

  const address = academyInfo?.address || "전남 광양시 무등길 47 (중동 1549-9)";
  const phone = academyInfo?.phone || "061-745-3355";
  const hours = academyInfo?.hours || "평일 14:00~19:00 / 토 14:00~17:00";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 bg-background">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24 text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary mb-6">
              <span className="material-symbols-outlined text-base">location_on</span>
              오시는 길
            </p>
            <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl mb-6">
              광양시 <span className="text-primary">중동</span>에서 찾아뷁겠습니다
            </h1>
            <p className="text-lg text-secondary mb-8 max-w-3xl mx-auto">
              {address}
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* 지도 */}
          <Card className="mb-8 overflow-hidden">
            <div className="bg-muted h-96 flex items-center justify-center">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-muted-foreground mb-4">map</span>
                <p className="text-muted-foreground">
                  카카오맵 또는 네이버 지도를 여기에 임베드
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  iframe 또는 지도 API 사용
                </p>
              </div>
            </div>
          </Card>

          {/* 정보 카드 */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4 block">location_on</span>
                <h3 className="font-bold mb-2">주소</h3>
                <p className="text-sm text-muted-foreground">{address}</p>
                <Button 
                  variant="link" 
                  className="mt-2"
                  onClick={() => window.open(`https://map.kakao.com/link/search/${encodeURIComponent(address)}`, '_blank')}
                >
                  지도에서 보기
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4 block">phone</span>
                <h3 className="font-bold mb-2">연락처</h3>
                <p className="text-sm text-muted-foreground mb-1">{phone}</p>
                <Button variant="link" className="mt-2" onClick={() => window.location.href = `tel:${phone}`}>
                  전화 걸기
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <span className="material-symbols-outlined text-5xl text-primary mb-4 block">schedule</span>
                <h3 className="font-bold mb-2">운영 시간</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{hours}</p>
              </CardContent>
            </Card>
          </div>

          {/* 교통편 안내 */}
          <Card>
            <CardContent className="p-8">
              <h3 className="text-xl font-bold mb-6">교통편 안내</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">directions_car</span>
                    자가용
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    광양 중동 무등길 47번지<br />
                    주차 공간 이용 가능
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-green-600">directions_bus</span>
                    대중교통
                  </h4>
                  <p className="text-sm text-muted-foreground pl-8">
                    광양시 버스 이용<br />
                    중동 정류장 하차 후 도보 5분
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
