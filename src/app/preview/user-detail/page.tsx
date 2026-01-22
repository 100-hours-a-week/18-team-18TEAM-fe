"use client"

import * as React from "react"
import { toast, Toaster } from "@/shared"
import {
  CareerList,
  DetailTabs,
  LinksList,
  ProfileHeader,
  ProjectsList,
  SkillsList,
  ActivitiesList,
} from "@/features/user-detail/components"

const sampleProfile = {
  name: "홍길동",
  department: "개발팀",
  position: "시니어 개발자",
  company: "CARO Inc.",
  phone: "010-1234-5678",
  email: "hong@caro.kr",
  avatarSrc: null,
}

const sampleSkills = ["TypeScript", "React", "Java"]

const sampleLinks = [
  { id: "l1", title: "GitHub", url: "https://github.com", description: "소스 코드 저장소" },
  { id: "l2", title: "Portfolio", url: "https://example.com", description: "개인 포트폴리오" },
]

const sampleCareer = [
  { id: "c1", company: "CARO Inc.", position: "시니어 개발자", period: "2022.01 - 현재", description: "프론트엔드 리드" },
  { id: "c2", company: "ACME Corp", position: "주니어 개발자", period: "2019.03 - 2021.12", description: "웹 애플리케이션 개발" },
]

const sampleProjects = [
  { id: "p1", name: "AI 명함 생성", period: "2023.01 - 2023.12", description: "LLM 기반 OCR/추천" },
  { id: "p2", name: "사내 디자인 시스템", period: "2022.02 - 2022.08", description: "React + Tailwind 컴포넌트" },
]

const sampleActivities = [
  { id: "a1", title: "React Korea 컨퍼런스 발표", period: "2023.06", description: "프론트엔드 성능 최적화" },
  { id: "a2", title: "사내 해커톤 우승", period: "2022.10", description: "실시간 협업 툴 개발" },
]

export default function UserDetailPreviewPage() {
  const [activeTab, setActiveTab] = React.useState<"career" | "skills" | "links" | "projects" | "activities">("career")

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <Toaster />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">User Detail Component Preview</h1>
        <p className="text-sm text-muted-foreground">
          사용자 상세 화면용 컴포넌트를 단독으로 확인하는 페이지입니다.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">ProfileHeader</h2>
        <ProfileHeader data={sampleProfile} />
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">DetailTabs</h2>
        <DetailTabs
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab)
            toast.info(`탭 변경: ${tab}`)
          }}
        />
      </section>

      <section className="space-y-6">
        {activeTab === "career" && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-foreground">CareerList</h3>
            <CareerList items={sampleCareer} editable onEdit={(id) => toast.info(`경력 수정: ${id}`)} />
          </div>
        )}
        {activeTab === "skills" && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-foreground">SkillsList</h3>
            <SkillsList
              items={sampleSkills}
              editable
              onEdit={(skill) => toast.info(`스킬 수정: ${skill}`)}
            />
          </div>
        )}
        {activeTab === "links" && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-foreground">LinksList</h3>
            <LinksList items={sampleLinks} editable onEdit={(id) => toast.info(`링크 수정: ${id}`)} />
          </div>
        )}
        {activeTab === "projects" && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-foreground">ProjectsList</h3>
            <ProjectsList items={sampleProjects} editable onEdit={(id) => toast.info(`프로젝트 수정: ${id}`)} />
          </div>
        )}
        {activeTab === "activities" && (
          <div className="space-y-3">
            <h3 className="text-md font-semibold text-foreground">ActivitiesList</h3>
            <ActivitiesList items={sampleActivities} editable onEdit={(id) => toast.info(`활동 수정: ${id}`)} />
          </div>
        )}
      </section>
    </div>
  )
}
