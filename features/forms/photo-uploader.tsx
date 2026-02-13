"use client"

import type React from "react"

import { useRef } from "react"
import type { PhotoUpload } from "@/types"
import { generatePhotoId } from "@/utils/helpers"
import { Camera, X, RefreshCw } from "lucide-react"

interface PhotoUploaderProps {
  photos: PhotoUpload[]
  onPhotosChange: (photos: PhotoUpload[]) => void
  maxPhotos?: number
}

export function PhotoUploader({ photos, onPhotosChange, maxPhotos = 5 }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remaining = maxPhotos - photos.length
    const filesToAdd = files.slice(0, remaining)

    const newPhotos: PhotoUpload[] = filesToAdd.map((file) => ({
      id: generatePhotoId(),
      file,
      preview: URL.createObjectURL(file),
      status: "pending",
      progress: 0,
    }))

    onPhotosChange([...photos, ...newPhotos])

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemove = (id: string) => {
    const photo = photos.find((p) => p.id === id)
    if (photo) {
      URL.revokeObjectURL(photo.preview)
    }
    onPhotosChange(photos.filter((p) => p.id !== id))
  }

  const canAddMore = photos.length < maxPhotos

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Фотографии ({photos.length}/{maxPhotos})
        </label>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <img src={photo.preview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />

            {/* Upload progress overlay */}
            {photo.status === "uploading" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-center text-white">
                  <RefreshCw className="mx-auto h-5 w-5 animate-spin" />
                  <span className="text-xs">{photo.progress}%</span>
                </div>
              </div>
            )}

            {/* Error overlay */}
            {photo.status === "error" && (
              <div className="absolute inset-0 flex items-center justify-center bg-destructive/50">
                <span className="text-xs text-white">Ошибка</span>
              </div>
            )}

            {/* Done indicator */}
            {photo.status === "done" && (
              <div className="absolute bottom-1 right-1 rounded-full bg-green-500 p-1">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}

            {/* Remove button */}
            <button
              type="button"
              onClick={() => handleRemove(photo.id)}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Add photo button */}
        {canAddMore && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/50 text-muted-foreground hover:border-primary hover:text-primary"
          >
            <Camera className="h-6 w-6" />
            <span className="text-xs">Добавить</span>
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}
