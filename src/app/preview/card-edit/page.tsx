"use client"

import * as React from "react"
import { toast, Toaster } from "@/shared"
import {
  AwardForm,
  CareerForm,
  LinkForm,
  ProfileForm,
  ProjectForm,
  SkillsCombobox,
} from "@/features/card-edit/components"

export default function CardEditPreviewPage() {
  const [skills, setSkills] = React.useState<string[]>(["React", "TypeScript"])
  const [links, setLinks] = React.useState<
    { title: string; url: string; description?: string }[]
  >([])

  return (
    <div className="container mx-auto py-10 px-4 space-y-10">
      <Toaster />
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">
          Card Edit Component Preview
        </h1>
        <p className="text-sm text-muted-foreground">
          카드 편집 관련 폼/컴포넌트를 단독으로 확인하는 페이지입니다.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">ProfileForm</h2>
          <ProfileForm
            onSubmit={(data) => toast.success(`프로필 저장: ${data.name}`)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">LinkForm</h2>
          <LinkForm
            clearOnSubmit
            onSubmit={(data) => {
              setLinks((prev) => [...prev, data])
              toast.success(`링크 저장: ${data.title}`)
            }}
          />
          {links.length > 0 && (
            <div className="rounded-lg border border-border p-3 space-y-3">
              {links.map((link, idx) => (
                <div
                  key={`${link.title}-${idx}`}
                  className="flex items-start justify-between gap-2 border-b border-border pb-3 last:border-b-0 last:pb-0"
                >
                  <div className="space-y-1 text-sm">
                    <p className="font-medium text-foreground">{link.title}</p>
                    <a
                      href={link.url}
                      className="text-primary underline underline-offset-4 break-all"
                    >
                      {link.url}
                    </a>
                    {link.description && (
                      <p className="text-muted-foreground">{link.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setLinks((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="text-muted-foreground hover:text-destructive"
                    aria-label="링크 삭제"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">CareerForm</h2>
          <CareerForm
            onSubmit={(data) => toast.success(`경력 저장: ${data.company}`)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">ProjectForm</h2>
          <ProjectForm
            onSubmit={(data) => toast.success(`프로젝트 저장: ${data.name}`)}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">AwardForm</h2>
          <AwardForm
            onSubmit={(data) => toast.success(`이력 저장: ${data.title}`)}
          />
        </div>

        <div className="space-y-4 md:col-span-2">
          <h2 className="text-lg font-semibold text-foreground">SkillsCombobox</h2>
          <SkillsCombobox
            skills={skills}
            onChange={(next) => {
              setSkills(next)
              toast.info(`스킬: ${next.join(", ") || "없음"}`)
            }}
            suggestions={["React", "TypeScript", "Next.js", "Node.js", "AWS"]}
          />
        </div>
      </section>
    </div>
  )
}
