"use client"

import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from "lucide-react"

interface ErrorScreenProps {
  message: string
  onRetry?: () => void
  onBack?: () => void
}

export function ErrorScreen({ message, onRetry, onBack }: ErrorScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>

      <h2 className="mb-2 text-xl font-semibold text-foreground">Ошибка</h2>
      <p className="mb-6 text-center text-muted-foreground">{message}</p>

      <div className="flex gap-3">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Назад
          </Button>
        )}
        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Повторить
          </Button>
        )}
      </div>
    </div>
  )
}
