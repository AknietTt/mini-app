"use client"

import { useCallback, useRef, useState } from "react"
import { Camera, ImagePlus, Eye, Trash2, Loader2 } from "lucide-react"
import type { PhotoItem } from "@/lib/types"

interface PhotoUploaderProps {
  photos: PhotoItem[]
  onPhotosChange: (photos: PhotoItem[]) => void
  onViewPhoto: (photo: PhotoItem) => void
  maxPhotos: number
}

export function PhotoUploader({ photos, onPhotosChange, onViewPhoto, maxPhotos }: PhotoUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const [uploadingPhotos, setUploadingPhotos] = useState<PhotoItem[]>([])

  const canAddMore = photos.length < maxPhotos

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || !canAddMore) return

      const remainingSlots = maxPhotos - photos.length
      const filesToProcess = Array.from(files).slice(0, remainingSlots)

      const newPhotos: PhotoItem[] = filesToProcess.map((file) => ({
        id: crypto.randomUUID(),
        fileName: file.name,
        url: URL.createObjectURL(file),
        uploading: true,
        progress: 0,
      }))

      const updatedPhotos = [...photos, ...newPhotos]
      onPhotosChange(updatedPhotos)

      for (const photo of newPhotos) {
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise((resolve) => setTimeout(resolve, 200))
          // Update progress in parent state
          onPhotosChange(updatedPhotos.map((p) => (p.id === photo.id ? { ...p, progress } : p)))
        }
        // Mark as complete
        onPhotosChange(updatedPhotos.map((p) => (p.id === photo.id ? { ...p, uploading: false, progress: 100 } : p)))
        // Update updatedPhotos reference for next iteration
        updatedPhotos.forEach((p, i) => {
          if (p.id === photo.id) {
            updatedPhotos[i] = { ...p, uploading: false, progress: 100 }
          }
        })
      }
    },
    [photos, maxPhotos, canAddMore, onPhotosChange],
  )

  const handleDelete = useCallback(
    (photoId: string) => {
      onPhotosChange(photos.filter((p) => p.id !== photoId))
    },
    [photos, onPhotosChange],
  )

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-medium text-card-foreground">Фото</h3>
        <span className="text-xs text-muted-foreground">
          {photos.length}/{maxPhotos}
        </span>
      </div>

      {/* Photo grid */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo.url || "/placeholder.svg"} alt="Фото" className="h-full w-full object-cover" />

            {/* Upload progress overlay */}
            {photo.uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
                <div className="flex flex-col items-center gap-1">
                  <Loader2 className="h-5 w-5 animate-spin text-background" />
                  <span className="text-xs text-background">{photo.progress}%</span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {!photo.uploading && (
              <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 bg-gradient-to-t from-foreground/70 to-transparent p-2">
                <button
                  onClick={() => onViewPhoto(photo)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-background/90 text-foreground transition-colors hover:bg-background"
                  aria-label="Просмотр"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive/90 text-destructive-foreground transition-colors hover:bg-destructive"
                  aria-label="Удалить"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Error indicator */}
            {photo.error && (
              <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
                <span className="text-xs text-destructive">Ошибка</span>
              </div>
            )}
          </div>
        ))}

        {/* Empty slots */}
        {photos.length === 0 && (
          <div className="col-span-3 flex h-24 items-center justify-center rounded-lg border-2 border-dashed border-border">
            <span className="text-sm text-muted-foreground">Нет фото</span>
          </div>
        )}
      </div>

      {/* Upload buttons */}
      {canAddMore && (
        <div className="flex gap-2">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 touch-target"
          >
            <Camera className="h-4 w-4" />
            <span>Сфотографировать</span>
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-accent bg-accent/10 py-3 text-sm font-medium text-accent transition-colors hover:bg-accent/20 touch-target"
          >
            <ImagePlus className="h-4 w-4" />
            <span>Из галереи</span>
          </button>
        </div>
      )}

      {!canAddMore && <p className="text-center text-xs text-muted-foreground">Достигнут лимит фотографий</p>}

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileSelect(e.target.files)}
      />
    </div>
  )
}
