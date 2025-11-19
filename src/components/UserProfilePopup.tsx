"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface UserProfilePopupProps {
  userName: string;
  userRole?: string;
  onClose: () => void;
}

export function UserProfilePopup({ userName, userRole, onClose }: UserProfilePopupProps) {
  const [isFriend, setIsFriend] = useState(false);

  return (
    <>
      {/* 배경 오버레이 */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in"
        onClick={onClose}
      />
      
      {/* 프로필 팝업 */}
      <Card className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-6 w-80 animate-in zoom-in-95">
        <div className="space-y-4">
          {/* 프로필 헤더 */}
          <div className="flex items-center gap-3">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {userName.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground">{userName}</h3>
              <p className="text-sm text-muted-foreground">
                {userRole || "코딩메이커 회원"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* 정보 */}
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-base text-muted-foreground">
                school
              </span>
              <span className="text-foreground">수강 중인 클래스: 3개</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-base text-muted-foreground">
                emoji_events
              </span>
              <span className="text-foreground">완료한 프로젝트: 5개</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="material-symbols-outlined text-base text-muted-foreground">
                calendar_today
              </span>
              <span className="text-foreground">가입일: 2024년 3월</span>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="border-t border-border pt-4 space-y-2">
            <Button 
              className="w-full"
              variant={isFriend ? "outline" : "default"}
              onClick={() => {
                setIsFriend(!isFriend);
                alert(isFriend ? `${userName}님을 친구 목록에서 제거했습니다.` : `${userName}님에게 친구 요청을 보냈습니다!`);
              }}
            >
              <span className="material-symbols-outlined text-base">
                {isFriend ? "person_remove" : "person_add"}
              </span>
              {isFriend ? "친구 삭제" : "친구 추가"}
            </Button>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => {
                alert(`${userName}님에게 1:1 메시지를 보낼 수 있습니다.`);
                onClose();
              }}
            >
              <span className="material-symbols-outlined text-base">chat</span>
              1:1 메시지
            </Button>

            <Button 
              className="w-full" 
              variant="ghost"
              onClick={() => alert('신고 기능은 백엔드 연결 후 사용 가능합니다.')}
            >
              <span className="material-symbols-outlined text-base">flag</span>
              신고하기
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
