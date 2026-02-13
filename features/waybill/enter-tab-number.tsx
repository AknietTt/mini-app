"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"

interface EnterTabNumberProps {
  onSubmit: (tabNum: string) => void
  isLoading?: boolean
}

export function EnterTabNumber({ onSubmit, isLoading }: EnterTabNumberProps) {
  const [tabNum, setTabNum] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (tabNum.trim()) {
      onSubmit(tabNum.trim())
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 flex-col items-center justify-center px-6">
        <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <User className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-foreground">Осмотр транспорта</h1>
        <p className="mb-8 text-center text-muted-foreground">Введите табельный номер водителя</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          <Input
            type="text"
            inputMode="numeric"
            placeholder="Табельный номер"
            value={tabNum}
            onChange={(e) => setTabNum(e.target.value)}
            className="mb-4 h-14 text-center text-lg"
            autoFocus
          />

          <Button type="submit" className="h-14 w-full text-lg font-semibold" disabled={!tabNum.trim() || isLoading}>
            {isLoading ? "Загрузка..." : "Найти путевой лист"}
          </Button>
        </form>
      </div>
    </div>
  )
}
