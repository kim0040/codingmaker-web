"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { adminSidebar } from "@/data/admin";
import { useAuth } from "@/contexts/AuthContext";
import { api, endpoints } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function AcademyInfoPage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    hours: "",
    blog: "",
    instagram: "",
  });

  useEffect(() => {
    // Tier 1 권한 체크
    if (user && user.tier !== 1) {
      alert("접근 권한이 없습니다.");
      router.push("/");
      return;
    }
    
    if (user && token) {
      fetchAcademyInfo();
    }
  }, [user, token]);

  const fetchAcademyInfo = async () => {
    setIsLoading(true);
    try {
      const response: any = await api.get(endpoints.academy.info);
      if (response.success) {
        setFormData({
          name: response.data.name || "",
          phone: response.data.phone || "",
          address: response.data.address || "",
          hours: response.data.hours || "",
          blog: response.data.blog || "",
          instagram: response.data.instagram || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch academy info:", error);
      setMessage("정보를 불러올 수 없습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setMessage("로그인이 필요합니다.");
      return;
    }

    setIsSaving(true);
    setMessage("");

    try {
      const response: any = await api.put(
        endpoints.academy.update,
        formData,
        token
      );

      if (response.success) {
        setMessage("✓ 학원 정보가 수정되었습니다.");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error: any) {
      console.error("Failed to update academy info:", error);
      setMessage(error?.message || "수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (!user || user.tier !== 1) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>접근 권한이 없습니다.</p>
      </div>
    );
  }

  return (
    <DashboardLayout
      userName={user?.name || "관리자"}
      userSubtitle="Tier 1 - 최고 관리자"
      sidebarItems={adminSidebar}
      headerTitle="학원 정보 관리"
    >
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">학원 정보 관리</h1>
          <p className="text-muted-foreground mt-2">
            홈페이지에 표시될 학원 정보를 수정할 수 있습니다.
          </p>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">정보를 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>기본 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    학원 이름 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="코딩메이커학원"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    전화번호 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="061-745-3355"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    주소 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="전남 광양시 무등길 47 (중동 1549-9)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    운영 시간 <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="hours"
                    value={formData.hours}
                    onChange={handleChange}
                    placeholder="평일 14:00~19:00 / 토 14:00~17:00"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>SNS 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    네이버 블로그 URL
                  </label>
                  <Input
                    name="blog"
                    value={formData.blog}
                    onChange={handleChange}
                    placeholder="https://blog.naver.com/kkj0201"
                    type="url"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Instagram 계정
                  </label>
                  <Input
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="codingmaker_kj"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    @ 없이 계정명만 입력하세요
                  </p>
                </div>
              </CardContent>
            </Card>

            {message && (
              <div className={`mt-6 p-4 rounded-lg ${
                message.includes("✓") 
                  ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300" 
                  : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300"
              }`}>
                {message}
              </div>
            )}

            <div className="mt-6 flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={fetchAcademyInfo}
                disabled={isSaving}
              >
                <span className="material-symbols-outlined mr-2">refresh</span>
                초기화
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <span className="material-symbols-outlined mr-2 animate-spin">refresh</span>
                    저장 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined mr-2">save</span>
                    저장하기
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        <Card className="mt-8 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6">
            <h3 className="font-bold mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <span className="material-symbols-outlined">info</span>
              안내사항
            </h3>
            <ul className="text-sm space-y-1 text-blue-600 dark:text-blue-400">
              <li>• 수정한 정보는 즉시 홈페이지에 반영됩니다.</li>
              <li>• Tier 1 관리자만 이 페이지에 접근할 수 있습니다.</li>
              <li>• 전화번호와 주소 등 중요 정보는 신중하게 입력하세요.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
