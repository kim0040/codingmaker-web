"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { studentSidebar } from "@/data/student";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserProfilePopup } from "@/components/UserProfilePopup";

// Mock 데이터
const mockPost = {
  id: 101,
  title: "파이썬 프로젝트 팀원 구합니다! (2명)",
  author: "김민지",
  date: "2024-11-19",
  views: 256,
  likes: 32,
  content: `안녕하세요! 데이터 분석 프로젝트를 함께 진행할 팀원을 찾고 있습니다.

**📌 프로젝트 개요:**
광양시 상권 분석 및 시각화 프로젝트입니다.
공공 데이터 API를 활용해서 상권 데이터를 수집하고, 
pandas와 matplotlib으로 분석/시각화하는 작업입니다.

**🎯 모집 인원:**
- 파이썬 경험자 2명 (초급~중급)
- 데이터 분석에 관심 있으신 분
- 주 2회 이상 온라인 회의 가능하신 분

**⏰ 프로젝트 기간:**
2024년 12월 ~ 2025년 1월 (약 2개월)

**💻 기술 스택:**
- Python, pandas, numpy
- matplotlib, seaborn
- Jupyter Notebook

관심 있으신 분은 댓글이나 DM으로 연락 주세요!
포트폴리오 함께 만들어봐요 😊`,
};

const mockComments = [
  { id: 1, author: "이준호", date: "2024-11-19 14:30", content: "관심 있습니다! 파이썬 기초반 수강했는데 참여 가능할까요?", isAuthor: false },
  { id: 2, author: "김민지", date: "2024-11-19 14:35", content: "네! 기초반 수강하셨으면 충분합니다. DM으로 연락 드릴게요 👍", isAuthor: true },
  { id: 3, author: "박서현", date: "2024-11-19 15:20", content: "저도 참여하고 싶은데 matplotlib 경험이 없어도 괜찮나요?", isAuthor: false },
  { id: 4, author: "김민지", date: "2024-11-19 15:25", content: "괜찮습니다! 프로젝트 하면서 같이 배우면 돼요. 연락 주세요!", isAuthor: true },
  { id: 5, author: "최동현", date: "2024-11-19 16:10", content: "numpy는 필수인가요? pandas만 써봤는데...", isAuthor: false },
  { id: 6, author: "김민지", date: "2024-11-19 16:15", content: "numpy는 pandas에서 자동으로 사용되니 걱정 안 하셔도 됩니다 ㅎㅎ", isAuthor: true },
  { id: 7, author: "강지우", date: "2024-11-19 17:00", content: "주말에만 참여 가능한데 괜찮을까요?", isAuthor: false },
];

export default function CommunityPostPage() {
  const params = useParams();
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(mockComments);
  const [likes, setLikes] = useState(mockPost.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const handleSubmitComment = () => {
    if (!comment.trim()) return;

    const newComment = {
      id: comments.length + 1,
      author: "나",
      date: new Date().toLocaleString('ko-KR'),
      content: comment,
      isAuthor: false,
    };

    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <DashboardLayout
      userName="김코딩"
      userSubtitle="커뮤니티"
      sidebarItems={studentSidebar}
      bottomNavItems={[
        studentSidebar[0], // 대시보드
        studentSidebar[1], // 내 클래스
        studentSidebar[2], // 프로젝트
        studentSidebar[3], // LMS 강의실
        studentSidebar[5], // 채팅
      ]}
      headerTitle="커뮤니티"
      headerSubtitle="게시글 상세"
    >
      <div className="mx-auto max-w-4xl space-y-6 pb-20">
        {/* 뒤로가기 버튼 */}
        <Button 
          variant="ghost" 
          onClick={() => router.push('/community')}
          className="mb-4"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          목록으로
        </Button>

        {/* 게시글 본문 */}
        <Card className="p-6">
          <div className="space-y-4">
            {/* 제목 및 정보 */}
            <div className="border-b pb-4">
              <h1 className="text-2xl font-bold text-foreground mb-3">{mockPost.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <button 
                  onClick={() => setSelectedUser(mockPost.author)}
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-base">person</span>
                  {mockPost.author}
                </button>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  {mockPost.date}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">visibility</span>
                  {mockPost.views}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-base">thumb_up</span>
                  {mockPost.likes}
                </span>
              </div>
            </div>

            {/* 본문 내용 */}
            <div className="py-6 whitespace-pre-wrap text-foreground leading-relaxed">
              {mockPost.content}
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center gap-2 pt-4 border-t">
              <Button 
                variant={isLiked ? "default" : "outline"} 
                size="sm"
                onClick={() => {
                  if (isLiked) {
                    setLikes(likes - 1);
                    setIsLiked(false);
                  } else {
                    setLikes(likes + 1);
                    setIsLiked(true);
                  }
                }}
              >
                <span className="material-symbols-outlined text-base" style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  thumb_up
                </span>
                추천 {likes}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert('공유 링크가 복사되었습니다!');
                }}
              >
                <span className="material-symbols-outlined text-base">share</span>
                공유
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => alert('신고 기능은 백엔드 연결 후 사용 가능합니다.')}
              >
                <span className="material-symbols-outlined text-base">flag</span>
                신고
              </Button>
            </div>
          </div>
        </Card>

        {/* 댓글 섹션 (디씨 스타일) */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined">chat_bubble</span>
            댓글 {comments.length}
          </h2>

          {/* 댓글 목록 */}
          <div className="space-y-3 mb-6">
            {comments.map((c, index) => (
              <div 
                key={c.id} 
                className={`p-4 rounded-lg border ${
                  c.isAuthor 
                    ? 'bg-primary/5 border-primary/20' 
                    : 'bg-muted/30 border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* 댓글 번호 */}
                  <div className="flex-shrink-0 size-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* 작성자 정보 */}
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => setSelectedUser(c.author)}
                        className={`font-semibold hover:underline ${c.isAuthor ? 'text-primary' : 'text-foreground'}`}
                      >
                        {c.author}
                        {c.isAuthor && (
                          <span className="ml-2 text-xs bg-primary text-white px-2 py-0.5 rounded">
                            글쓴이
                          </span>
                        )}
                      </button>
                      <span className="text-xs text-muted-foreground">{c.date}</span>
                    </div>
                    
                    {/* 댓글 내용 */}
                    <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                      {c.content}
                    </p>

                    {/* 댓글 액션 */}
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => alert('댓글 추천 기능은 백엔드 연결 후 사용 가능합니다.')}
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">thumb_up</span>
                        추천
                      </button>
                      <button 
                        onClick={() => alert(`${c.author}님에게 답글을 달 수 있습니다.`)}
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">reply</span>
                        답글
                      </button>
                      <button 
                        onClick={() => alert('댓글 신고 기능은 백엔드 연결 후 사용 가능합니다.')}
                        className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">flag</span>
                        신고
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 댓글 작성 (모바일 최적화) */}
          <div className="sticky bottom-0 lg:relative bg-background pt-4 border-t">
            <div className="flex gap-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 min-h-[80px] lg:min-h-[100px] rounded-lg border border-border bg-background px-4 py-3 text-sm resize-none focus:border-primary focus:outline-none"
                onFocus={(e) => {
                  // 모바일에서 키보드 나올 때 부드럽게 스크롤
                  setTimeout(() => {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 300);
                }}
              />
              <Button 
                onClick={handleSubmitComment}
                disabled={!comment.trim()}
                className="self-end"
              >
                <span className="material-symbols-outlined">send</span>
                작성
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* 유저 프로필 팝업 */}
      {selectedUser && (
        <UserProfilePopup
          userName={selectedUser}
          userRole={selectedUser === mockPost.author ? "게시글 작성자" : "커뮤니티 회원"}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </DashboardLayout>
  );
}
