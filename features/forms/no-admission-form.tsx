"use client"

import type { PhotoUpload, NoAdmissionCategory } from "@/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { PhotoUploader } from "./photo-uploader"
import { CATEGORY_LABELS } from "@/types"
import { ArrowLeft } from "lucide-react"

interface NoAdmissionFormProps {
  selectedCategories: NoAdmissionCategory[]
  comment: string
  photos: PhotoUpload[]
  onToggleCategory: (category: NoAdmissionCategory) => void
  onCommentChange: (comment: string) => void
  onPhotosChange: (photos: PhotoUpload[]) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting?: boolean
}

export function NoAdmissionForm({
  selectedCategories,
  comment,
  photos,
  onToggleCategory,
  onCommentChange,
  onPhotosChange,
  onSubmit,
  onBack,
  isSubmitting,
}: NoAdmissionFormProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="rounded-lg p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Не допуск</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6 px-4 py-6">
        {/* Categories */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Причины не допуска *</label>
          <div className="grid grid-cols-1 gap-2">
            {(Object.keys(CATEGORY_LABELS) as NoAdmissionCategory[]).map((category) => {
              const isSelected = selectedCategories.includes(category)
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => onToggleCategory(category)}
                  className={`flex items-center justify-between rounded-lg border-2 p-4 text-left transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-card hover:border-accent"
                  }`}
                >
                  <span className="font-medium">{CATEGORY_LABELS[category]}</span>
                  {isSelected && (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Comment */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Комментарий</label>
          <Textarea
            value={comment}
            onChange={(e) => onCommentChange(e.target.value)}
            placeholder="Дополнительная информация..."
            className="min-h-[100px] resize-none"
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
          disabled={selectedCategories.length === 0 || isSubmitting}
        >
          {isSubmitting ? "Отправка..." : "Отправить"}
        </Button>
      </div>
    </div>
  )
}
