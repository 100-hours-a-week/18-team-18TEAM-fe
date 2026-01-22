"use client"

import * as React from "react"
import { XIcon, PlusIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

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
  placeholder = "스킬을 입력하세요",
  className,
}: SkillsComboboxProps) {
  const [inputValue, setInputValue] = React.useState("")
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !skills.includes(s)
  )

  const addSkill = (skill: string) => {
    if (skill.trim() && !skills.includes(skill.trim())) {
      onChange([...skills, skill.trim()])
    }
    setInputValue("")
    setShowSuggestions(false)
  }

  const removeSkill = (skill: string) => {
    onChange(skills.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(inputValue)
    }
  }

  return (
    <div data-slot="skills-combobox" className={cn("space-y-3", className)}>
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
            "w-full px-3 py-2 pr-10 rounded-lg bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
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
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          <PlusIcon className="size-4" />
        </Button>

        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 max-h-48 overflow-auto rounded-lg border border-border bg-card shadow-lg">
            {filteredSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => addSkill(suggestion)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
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
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
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
