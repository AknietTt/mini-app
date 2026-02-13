"use client"

import { useEffect, useState } from "react"
import { CheckCircle } from "lucide-react"

export function SuccessToast() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed inset-x-4 top-4 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-3 rounded-lg bg-success p-4 shadow-lg">
        <CheckCircle className="h-5 w-5 text-success-foreground" />
        <span className="text-sm font-medium text-success-foreground">Данные успешно отправлены</span>
      </div>
    </div>
  )
}
