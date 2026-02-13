"use client"

import type { PhotoUpload } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PhotoUploader } from "./photo-uploader"
import { AlertTriangle } from "lucide-react"

interface AccidentFormProps {
  comment: string
  photos: PhotoUpload[]
  onCommentChange: (comment: string) => void
  onPhotosChange: (photos: PhotoUpload[]) => void
  onSubmit: () => void
  isSubmitting?: boolean
}

export function AccidentForm({
  comment,
  photos,
  onCommentChange,
  onPhotosChange,
  onSubmit,
  isSubmitting,
}: AccidentFormProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">Фиксация ДТП</h1>
        </div>
      </div>

      {/* Warning banner */}
      <div className="mx-4 mt-4 rounded-lg bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Транспортное средство участвовало в ДТП. Зафиксируйте повреждения.</p>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 px-4 py-6">
        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Описание повреждений *</label>
          <Textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Опишите видимые повреждения..."
            className="min-h-[120px] resize-none"
          />
        </div>

        {/* Photos */}
        <PhotoUploader photos={photos} onPhotosChange={onPhotosChange} maxPhotos={5} />
      </div>

      {/* Fixed bottom action */}
      <div className="sticky bottom-0 border-t bg-background px-4 py-4">
        <Button
          className="h-14 w-full text-base font-semibold"
          onClick={onSubmit}
          disabled={!comment.trim() || isSubmitting}
        >
          {isSubmitting ? "Отправка..." : "Отправить"}
        </Button>
      </div>
    </div>
  )
}
