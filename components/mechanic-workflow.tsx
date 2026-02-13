"use client"

import { useEffect, useCallback, useState } from "react"
import { useWorkflow } from "@/hooks/use-workflow"
import { useTelegramInit } from "@/hooks/use-telegram-init"
import { getWaybill, postWaybill } from "@/services/api/oneC"
import { uploadPhoto } from "@/services/api/minio"
import { categoriesToReasonArray, formatDate } from "@/utils/helpers"
import type { WaybillPostPayload, PhotoUpload } from "@/types"

import { EnterTabNumber } from "@/features/waybill/enter-tab-number"
import { WaybillCard } from "@/features/waybill/waybill-card"
import { NoAdmissionForm } from "@/features/forms/no-admission-form"
import { LoadingScreen } from "@/components/loading-screen"
import { ErrorScreen } from "@/components/error-screen"
import { SuccessToast } from "@/components/success-toast"

export function MechanicWorkflow() {
  const { chatId, isReady } = useTelegramInit()
  const [showSuccess, setShowSuccess] = useState(false)
  const [showAccidentForm, setShowAccidentForm] = useState(false)
  const [accidentSaved, setAccidentSaved] = useState(false)

  const {
    state,
    setChatId,
    setTabNum,
    setStep,
    setWaybill,
    setError,
    toggleCategory,
    setNoAdmissionComment,
    setNoAdmissionPhotos,
    updateNoAdmissionPhoto,
    setAccidentComment,
    setAccidentPhotos,
    updateAccidentPhoto,
    reset,
  } = useWorkflow()

  // Initialize chatId from Telegram
  useEffect(() => {
    if (isReady && chatId) {
      setChatId(chatId)
    }
  }, [isReady, chatId, setChatId])

  // Fetch waybill
  const handleFetchWaybill = useCallback(
    async (tabNum: string) => {
      setTabNum(tabNum)
      setStep("loadingWaybill")

      try {
        setShowAccidentForm(false)
        setAccidentSaved(false)
        setAccidentComment("")
        setAccidentPhotos([])
        const waybill = await getWaybill(tabNum, formatDate(new Date()))
        setWaybill(waybill)

        // If arrival with accident, show card with ДТП action
        setStep("waybillCard")
      } catch (err) {
        setError(err instanceof Error ? err.message : "РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё РїСѓС‚РµРІРѕРіРѕ Р»РёСЃС‚Р°")
        setStep("enterTabNumber")
      }
    },
    [setTabNum, setStep, setWaybill, setError, setAccidentComment, setAccidentPhotos],
  )

  // Upload all photos and return fileNames
  const uploadAllPhotos = useCallback(
    async (
      photos: PhotoUpload[],
      updateFn: (id: string, updates: Partial<PhotoUpload>) => void,
    ) => {
      const results: string[] = []

      for (const photo of photos) {
        if (photo.status === "done" && photo.fileName) {
          results.push(photo.fileName)
          continue
        }

        updateFn(photo.id, { status: "uploading", progress: 0 })

        try {
          const result = await uploadPhoto(photo.file, (progress: number) => {
            updateFn(photo.id, { progress })
          })
          updateFn(photo.id, { status: "done", fileName: result.fileName, progress: 100 })
          results.push(result.fileName)
        } catch {
          updateFn(photo.id, { status: "error", error: "РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё" })
          throw new Error("РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ С„РѕС‚Рѕ")
        }
      }

      return results
    },
    [],
  )

  const isArrivalAccident = state.waybill?.type === "arrival" && state.waybill.wasAccident

  // Handle admission (РґРѕРїСѓСЃРє)
  const handleAdmission = useCallback(async () => {
    if (!state.waybill || !state.chatId) return

    setStep("submitting")

    try {
      const payload: WaybillPostPayload = {
        chat_id: state.chatId,
        event_id: "mechanic",
        type: state.waybill.type,
        PL_ID: state.waybill.PL_ID,
        status: true,
        tech_status: true,
        ...(state.waybill.type === "arrival" && {
          external_inspection: false,
          exit_line: true,
        }),
      }

      await postWaybill(payload)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setShowAccidentForm(false)
        setAccidentSaved(false)
        reset()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё")
      setStep("waybillCard")
    }
  }, [state.waybill, state.chatId, setStep, setError, reset])

  // Handle no admission (РЅРµ РґРѕРїСѓСЃРє)
  const handleNoAdmissionSubmit = useCallback(async () => {
    if (!state.waybill || !state.chatId) return

    setStep("submitting")

    try {
      // Upload photos first
      const photoResults = await uploadAllPhotos(state.noAdmissionDraft.photos, updateNoAdmissionPhoto)

      const payload: WaybillPostPayload = {
        chat_id: state.chatId,
        event_id: "mechanic",
        type: state.waybill.type,
        PL_ID: state.waybill.PL_ID,
        status: false,
        tech_status: true,
        reason: categoriesToReasonArray(state.noAdmissionDraft.selectedCategories),
        comment: state.noAdmissionDraft.comment.trim() || undefined,
        photo: photoResults.length > 0 ? photoResults : undefined,
      }

      await postWaybill(payload)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setShowAccidentForm(false)
        setAccidentSaved(false)
        reset()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё")
      setStep("departureNoAdmissionForm")
    }
  }, [
    state.waybill,
    state.chatId,
    state.noAdmissionDraft,
    setStep,
    setError,
    reset,
    uploadAllPhotos,
    updateNoAdmissionPhoto,
  ])

  // Handle accident submit
  const handleAccidentDecision = useCallback(async (status: boolean) => {
    if (!state.waybill || !state.chatId) return

    setStep("submitting")

    try {
      // Upload photos first
      const photoResults = await uploadAllPhotos(state.accidentDraft.photos, updateAccidentPhoto)

      const payload: WaybillPostPayload = {
        chat_id: state.chatId,
        event_id: "mechanic",
        type: state.waybill.type,
        PL_ID: state.waybill.PL_ID,
        status,
        tech_status: true,
        ...(state.waybill.type === "arrival" && {
          external_inspection: false,
          exit_line: true,
        }),
        reason: ["ДТП"],
        comment: state.accidentDraft.comment.trim() || undefined,
        photo: photoResults.length > 0 ? photoResults : undefined,
      }

      await postWaybill(payload)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setShowAccidentForm(false)
        setAccidentSaved(false)
        reset()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё")
      setStep("waybillCard")
    }
  }, [state.waybill, state.chatId, state.accidentDraft, setStep, setError, reset, uploadAllPhotos, updateAccidentPhoto])

  const handleAccidentSave = useCallback(() => {
    setAccidentSaved(true)
  }, [])

  const handleAccidentCommentChange = useCallback(
    (comment: string) => {
      setAccidentSaved(false)
      setAccidentComment(comment)
    },
    [setAccidentComment],
  )

  const handleAccidentPhotosChange = useCallback(
    (photos: PhotoUpload[]) => {
      setAccidentSaved(false)
      setAccidentPhotos(photos)
    },
    [setAccidentPhotos],
  )

  const handleAdmissionClick = useCallback(() => {
    if (!state.waybill) return

    if (isArrivalAccident) {
      if (!showAccidentForm) {
        setShowAccidentForm(true)
        return
      }
      if (!accidentSaved) return
      void handleAccidentDecision(true)
      return
    }

    void handleAdmission()
  }, [state.waybill, isArrivalAccident, showAccidentForm, accidentSaved, handleAccidentDecision, handleAdmission])

  const handleNoAdmissionClick = useCallback(() => {
    if (!state.waybill) return

    if (isArrivalAccident) {
      if (!showAccidentForm) {
        setShowAccidentForm(true)
        return
      }
      if (!accidentSaved) return
      void handleAccidentDecision(false)
      return
    }

    setStep("departureNoAdmissionForm")
  }, [state.waybill, isArrivalAccident, showAccidentForm, accidentSaved, handleAccidentDecision, setStep])

  // Show loading until Telegram is ready
  if (!isReady) {
    return <LoadingScreen message="РРЅРёС†РёР°Р»РёР·Р°С†РёСЏ..." />
  }

  // Render based on current step
  switch (state.step) {
    case "enterTabNumber":
      return (
        <>
          {state.error && <ErrorScreen message={state.error} onRetry={() => setError(null)} />}
          {!state.error && <EnterTabNumber onSubmit={handleFetchWaybill} />}
        </>
      )

    case "loadingWaybill":
      return <LoadingScreen message="Р—Р°РіСЂСѓР·РєР° РїСѓС‚РµРІРѕРіРѕ Р»РёСЃС‚Р°..." />

    case "waybillCard":
      return (
        <>
          {state.waybill && (
            <WaybillCard
              waybill={state.waybill}
              onAdmission={handleAdmissionClick}
              onNoAdmission={handleNoAdmissionClick}
              onAccidentOpen={() => setShowAccidentForm(true)}
              onAccidentSave={handleAccidentSave}
              onAccidentCommentChange={handleAccidentCommentChange}
              onAccidentPhotosChange={handleAccidentPhotosChange}
              accidentDraft={state.accidentDraft}
              showAccidentForm={showAccidentForm}
              accidentSaved={accidentSaved}
              disableActions={isArrivalAccident && !accidentSaved}
            />
          )}
        </>
      )

    case "departureNoAdmissionForm":
      return (
        <NoAdmissionForm
          selectedCategories={state.noAdmissionDraft.selectedCategories}
          comment={state.noAdmissionDraft.comment}
          photos={state.noAdmissionDraft.photos}
          onToggleCategory={toggleCategory}
          onCommentChange={setNoAdmissionComment}
          onPhotosChange={setNoAdmissionPhotos}
          onSubmit={handleNoAdmissionSubmit}
          onBack={() => setStep("waybillCard")}
        />
      )

    case "submitting":
      return <LoadingScreen message="РћС‚РїСЂР°РІРєР° РґР°РЅРЅС‹С…..." />

    default:
      return (
        <>
          {showSuccess && <SuccessToast />}
          <EnterTabNumber onSubmit={handleFetchWaybill} />
        </>
      )
  }
}
