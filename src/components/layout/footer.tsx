"use client";

import Link from "next/link";
import { useAcademyInfo } from "@/hooks/useAcademyInfo";

export function Footer() {
  const { info } = useAcademyInfo();
  return (
    <footer className="bg-background border-t">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Academy Info */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-2xl text-primary">data_object</span>
              <h3 className="text-base font-bold text-foreground">코딩메이커 아카데미 허브</h3>
            </div>
            <address className="text-sm text-muted-foreground not-italic space-y-1">
              <p>주소: {info.address}</p>
              <p>연락처: {info.phone}</p>
              <p>운영시간: {info.hours} {info.hoursWeekend && `/ ${info.hoursWeekend}`}</p>
            </address>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">바로가기</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#about" className="text-muted-foreground hover:text-primary transition-colors">
                  학원소개
                </Link>
              </li>
              <li>
                <Link href="/#courses" className="text-muted-foreground hover:text-primary transition-colors">
                  과정안내 (코딩/임베디드/웹툰)
                </Link>
              </li>
              <li>
                <Link href="/#highlights" className="text-muted-foreground hover:text-primary transition-colors">
                  학원특징
                </Link>
              </li>
              <li>
                <Link href="https://blog.naver.com/kkj0201" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                  네이버 블로그
                </Link>
              </li>
            </ul>
          </div>

          {/* Social / External */}
          <div className="flex flex-col gap-4">
            <h4 className="font-bold text-foreground">소셜 미디어</h4>
            <div className="flex space-x-4 text-muted-foreground">
              {info.instagram && (
                <Link href={info.instagram} target="_blank" className="hover:text-primary transition-colors">
                  Instagram
                </Link>
              )}
              {info.blog && (
                <Link href={info.blog} target="_blank" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              )}
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>© 2024 CodingMaker Academy. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
