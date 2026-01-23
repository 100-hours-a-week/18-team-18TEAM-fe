'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

type TabId = 'career' | 'skills' | 'links' | 'projects' | 'activities'

interface Tab {
  id: TabId
  label: string
}

const tabs: Tab[] = [
  { id: 'career', label: '경력' },
  { id: 'skills', label: '기술' },
  { id: 'links', label: '링크' },
  { id: 'projects', label: '프로젝트' },
  { id: 'activities', label: '활동' },
]

interface DetailTabsProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  className?: string
}

function DetailTabs({ activeTab, onTabChange, className }: DetailTabsProps) {
  return (
    <div
      data-slot="detail-tabs"
      role="tablist"
      className={cn(
        'scrollbar-hide border-border flex gap-1 overflow-x-auto border-b',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onTabChange(tab.id)}
          className={cn(
            '-mb-px border-b-2 px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'border-primary text-foreground'
              : 'text-muted-foreground hover:text-foreground border-transparent'
          )}
          aria-selected={activeTab === tab.id}
          role="tab"
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export { DetailTabs, tabs }
export type { DetailTabsProps, TabId }
