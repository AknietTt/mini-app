import { Loader2 } from "lucide-react"

interface LoadingScreenProps {
  message?: string
}

export function LoadingScreen({ message = "Загрузка..." }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">{message}</p>
    </div>
  )
}
