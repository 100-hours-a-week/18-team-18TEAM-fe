"use client"

import * as React from "react"
import { ChartCard, HexagonChart, SkillBarChart } from "@/features/charts/components"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

const hexagonData = [
  { label: "기술력", value: 85 },
  { label: "협업", value: 90 },
  { label: "소통", value: 75 },
  { label: "리더십", value: 70 },
  { label: "창의성", value: 80 },
  { label: "전문성", value: 88 },
]

const skillBars = [
  { label: "React", value: 90 },
  { label: "TypeScript", value: 85 },
  { label: "Next.js", value: 80 },
  { label: "Node.js", value: 70 },
]

export default function ChartsPreviewPage() {
  const [selectedSkill, setSelectedSkill] = React.useState<{ label: string; value: number } | null>(null)

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Charts Component Preview</h1>
        <p className="text-sm text-muted-foreground">차트 관련 컴포넌트 렌더링을 확인합니다.</p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">HexagonChart</h2>
        <div className="flex justify-center">
          <HexagonChart data={hexagonData} size={300} />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">SkillBarChart</h2>
        <div className="max-w-xl">
          <SkillBarChart
            data={skillBars}
            onBarClick={(item) => setSelectedSkill(item)}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">ChartCard</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <ChartCard title="종합 역량" description="AI 분석 기반 점수">
            <HexagonChart data={hexagonData} size={220} />
          </ChartCard>
          <ChartCard title="기술 스택">
            <SkillBarChart
              data={skillBars}
              onBarClick={(item) => setSelectedSkill(item)}
            />
          </ChartCard>
        </div>
      </section>

      <Dialog
        open={!!selectedSkill}
        onOpenChange={(open) => !open && setSelectedSkill(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI 분석 요약</DialogTitle>
            <DialogDescription>
              {selectedSkill
                ? `${selectedSkill.label} 역량은 ${selectedSkill.value}점입니다. AI가 분석한 내용을 여기에 출력합니다.`
                : "선택된 항목이 없습니다."}
            </DialogDescription>
          </DialogHeader>
          {selectedSkill && (
            <div className="text-sm text-foreground space-y-2">
              <p>
                {selectedSkill.label} 스킬에 대한 추가 인사이트를 여기에 표시하세요.
              </p>
              <p className="text-muted-foreground">
                예: 최근 프로젝트에서의 사용 빈도, 팀 피드백, 성장 추세 등.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
