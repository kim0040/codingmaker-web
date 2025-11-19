"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { academyProfile } from "@/data/academy";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80">
            <span className="material-symbols-outlined text-3xl">data_object</span>
            <span className="text-lg font-bold tracking-tight text-foreground">
              {academyProfile.brand}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-8">
            <Link href="/#about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              학원소개
            </Link>
            <Link href="/#courses" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              과정안내
            </Link>
            <Link href="/#highlights" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              학원특징
            </Link>
            <Link href="/#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              상담문의
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/auth">
              <Button variant="ghost" className="font-bold">로그인</Button>
            </Link>
            <Link href="/auth">
              <Button className="font-bold">회원가입</Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground"
          >
            <span className="material-symbols-outlined">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="flex flex-col space-y-1 p-4">
            <Link 
              href="/#about" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              학원소개
            </Link>
            <Link 
              href="/#courses"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              과정안내
            </Link>
            <Link 
              href="/#highlights"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              학원특징
            </Link>
            <Link 
              href="/#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
            >
              상담문의
            </Link>
            <div className="border-t pt-2 mt-2 space-y-2">
              <Link 
                href="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button variant="ghost" className="w-full font-bold justify-start">
                  로그인
                </Button>
              </Link>
              <Link 
                href="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full font-bold">
                  회원가입
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
