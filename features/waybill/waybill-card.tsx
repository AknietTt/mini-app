"use client"

import type { WaybillDTO, AccidentDraft } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { PhotoUploader } from "@/features/forms/photo-uploader"
import { User, Bus, Route, AlertTriangle } from "lucide-react"

interface WaybillCardProps {
  waybill: WaybillDTO
  onAdmission: () => void
  onNoAdmission: () => void
  onAccidentOpen?: () => void
  onAccidentSave?: () => void
  onAccidentCommentChange?: (comment: string) => void
  onAccidentPhotosChange?: (photos: AccidentDraft["photos"]) => void
  accidentDraft?: AccidentDraft
  showAccidentForm?: boolean
  accidentSaved?: boolean
  disableActions?: boolean
  isSubmitting?: boolean
}

export function WaybillCard({
  waybill,
  onAdmission,
  onNoAdmission,
  onAccidentOpen,
  onAccidentSave,
  onAccidentCommentChange,
  onAccidentPhotosChange,
  accidentDraft,
  showAccidentForm,
  accidentSaved,
  disableActions,
  isSubmitting,
}: WaybillCardProps) {
  const isArrival = waybill.type === "arrival"
  const hasAccident = isArrival && waybill.wasAccident
  const shouldShowAccidentForm = hasAccident && showAccidentForm && accidentDraft
  const actionsDisabled = Boolean(isSubmitting || disableActions)

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 px-4 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Путевой лист</h1>
          <Badge variant={isArrival ? "secondary" : "default"}>{isArrival ? "Заезд" : "Выезд"}</Badge>
        </div>

        {/* Accident warning */}
        {hasAccident && (
          <div className="mb-4 flex items-center gap-3 rounded-lg bg-destructive/10 p-4">
            <AlertTriangle className="h-6 w-6 shrink-0 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Зафиксировано ДТП</p>
              <p className="text-sm text-destructive/80">Требуется фиксация повреждений</p>
            </div>
          </div>
        )}

        {/* Waybill info card */}
        <Card className="mb-6">
          <CardContent className="space-y-4 p-4">
            {/* Driver */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Водитель</p>
                <p className="font-medium text-foreground">{waybill.driver.fullName}</p>
                <p className="text-sm text-muted-foreground">Таб. № {waybill.driver.tabNum}</p>
              </div>
            </div>

            {/* Bus */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/50">
                <Bus className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Транспортное средство</p>
                <p className="font-medium text-foreground">{waybill.bus.model}</p>
                <p className="text-sm text-muted-foreground">
                  Гар. № {waybill.bus.garageNum} • {waybill.bus.govNum}
                </p>
              </div>
            </div>

            {/* Route */}
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                <Route className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Маршрут</p>
                <p className="font-medium text-foreground">{waybill.route}</p>
                {waybill.exitCode !== null && (
                  <p className="text-sm text-muted-foreground">Выход № {waybill.exitCode}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {hasAccident && (
          <p className="mb-4 text-center text-sm font-medium text-destructive">ДТП: требуется заполнить акт</p>
        )}

        {shouldShowAccidentForm && onAccidentCommentChange && onAccidentPhotosChange && (
          <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-foreground">Форма ДТП</p>
              {accidentSaved && <span className="text-xs text-muted-foreground">Сохранено</span>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Комментарий *</label>
              <Textarea
                value={accidentDraft.comment}
                onChange={(e) => onAccidentCommentChange(e.target.value)}
                placeholder="Опишите обстоятельства ДТП..."
                className="min-h-[120px] resize-none"
              />
            </div>
            <div className="mt-4">
              <PhotoUploader photos={accidentDraft.photos} onPhotosChange={onAccidentPhotosChange} maxPhotos={5} />
            </div>
            {onAccidentSave && (
              <Button
                className="mt-4 h-11 w-full text-base font-semibold"
                onClick={onAccidentSave}
                disabled={!accidentDraft.comment.trim() || isSubmitting}
              >
                {accidentSaved ? "Сохранено" : "Сохранить ДТП"}
              </Button>
            )}
          </div>
        )}

        {/* PL ID */}
        <p className="mb-4 text-center text-sm text-muted-foreground">ПЛ № {waybill.PL_Number || waybill.PL_ID}</p>
      </div>

      {/* Fixed bottom actions */}
      <div className="sticky bottom-0 border-t bg-background px-4 py-4">
        {hasAccident && !showAccidentForm && onAccidentOpen && (
          <Button
            variant="destructive"
            className="mb-3 h-12 w-full text-base font-semibold"
            onClick={onAccidentOpen}
            disabled={isSubmitting}
          >
            Заполнить ДТП
          </Button>
        )}
        {hasAccident && disableActions && (
          <p className="mb-3 text-center text-xs text-muted-foreground">
            Сначала заполните и сохраните форму ДТП
          </p>
        )}
        <div className="flex gap-3">
          <Button
            variant="destructive"
            className="h-14 flex-1 text-base font-semibold"
            onClick={onNoAdmission}
            disabled={actionsDisabled}
          >
            Не допуск
          </Button>
          <Button className="h-14 flex-1 text-base font-semibold" onClick={onAdmission} disabled={actionsDisabled}>
            {isSubmitting ? "Отправка..." : "Допуск"}
          </Button>
        </div>
      </div>
    </div>
  )
}
