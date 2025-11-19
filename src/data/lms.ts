import type { CurriculumStep } from "@/types";

export const curriculumList: CurriculumStep[] = [
  {
    title: "1. 환경 설정 및 소개",
    description: "IDE 세팅 및 프로젝트 구조 이해",
    status: "completed",
  },
  {
    title: "2. 기본 문법 복습",
    description: "변수/조건문/반복문 실습",
    status: "completed",
  },
  {
    title: "3. 함수와 모듈화",
    description: "재사용 가능한 함수 작성",
    status: "completed",
  },
  {
    title: "4. 자료구조 응용",
    description: "리스트/딕셔너리 활용",
    status: "in-progress",
  },
  {
    title: "5. 파일 입출력",
    description: "CSV/JSON 데이터 다루기",
    status: "upcoming",
  },
];

export const exampleCode = {
  python: `def calculate_average(scores):
    total = sum(scores)
    return total / len(scores)

scores = [92, 85, 74, 88, 95]
print(f"평균 점수: {calculate_average(scores):.2f}")
`,
  c: `#include <stdio.h>

double calculate_average(int scores[], int length) {
    int total = 0;
    for (int i = 0; i < length; i++) {
        total += scores[i];
    }
    return (double) total / length;
}

int main() {
    int scores[] = {92, 85, 74, 88, 95};
    double average = calculate_average(scores, 5);
    printf("평균 점수: %.2f\n", average);
    return 0;
}
`,
};
