'use client'

import * as React from 'react'
import { XIcon, PlusIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SkillsComboboxProps {
  skills: string[]
  onChange: (skills: string[]) => void
  suggestions?: string[]
  placeholder?: string
  className?: string
}

function SkillsCombobox({
  skills,
  onChange,
  suggestions = [],
  placeholder = '스킬을 입력하세요',
  className,
}: SkillsComboboxProps) {
  const [inputValue, setInputValue] = React.useState('')
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) && !skills.includes(s)
  )

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      onChange([...skills, skill.trim()])
    }
    setInputValue('')
    setShowSuggestions(false)
  }

  const removeSkill = (skill: string) => {
    onChange(skills.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill(inputValue)
    }
  }

  return (
    <div data-slot="skills-combobox" className={cn('space-y-3', className)}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'bg-muted/50 border-border text-foreground placeholder:text-muted-foreground w-full rounded-lg border px-3 py-2 pr-10 text-sm',
            'focus:ring-ring focus:border-transparent focus:ring-2 focus:outline-none'
          )}
        />
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => {
            if (inputValue.trim()) {
              addSkill(inputValue)
            } else {
              setShowSuggestions(true)
              inputRef.current?.focus()
            }
          }}
          className="absolute top-1/2 right-1 -translate-y-1/2"
        >
          <PlusIcon className="size-4" />
        </Button>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="border-border bg-card absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-auto rounded-lg border shadow-lg">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSkill(suggestion)}
                className="hover:bg-muted w-full px-3 py-2 text-left text-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {skills.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span
              key={skill}
              className="bg-primary/10 text-primary inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="hover:text-destructive"
              >
                <XIcon className="size-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export { SkillsCombobox }
export type { SkillsComboboxProps }
