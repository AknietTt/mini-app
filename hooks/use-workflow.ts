"use client"

import { useReducer, useCallback } from "react"
import type { WorkflowState, WorkflowStep, WaybillDTO, NoAdmissionCategory, PhotoUpload } from "@/types"

const initialState: WorkflowState = {
  step: "enterTabNumber",
  chatId: null,
  tabNum: "",
  waybill: null,
  noAdmissionDraft: {
    selectedCategories: [],
    comment: "",
    photos: [],
  },
  accidentDraft: {
    comment: "",
    photos: [],
  },
  error: null,
}

type Action =
  | { type: "SET_CHAT_ID"; chatId: string }
  | { type: "SET_TAB_NUM"; tabNum: string }
  | { type: "SET_STEP"; step: WorkflowStep }
  | { type: "SET_WAYBILL"; waybill: WaybillDTO }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "TOGGLE_CATEGORY"; category: NoAdmissionCategory }
  | { type: "SET_NO_ADMISSION_COMMENT"; comment: string }
  | { type: "SET_NO_ADMISSION_PHOTOS"; photos: PhotoUpload[] }
  | { type: "UPDATE_NO_ADMISSION_PHOTO"; id: string; updates: Partial<PhotoUpload> }
  | { type: "SET_ACCIDENT_COMMENT"; comment: string }
  | { type: "SET_ACCIDENT_PHOTOS"; photos: PhotoUpload[] }
  | { type: "UPDATE_ACCIDENT_PHOTO"; id: string; updates: Partial<PhotoUpload> }
  | { type: "RESET" }

function reducer(state: WorkflowState, action: Action): WorkflowState {
  switch (action.type) {
    case "SET_CHAT_ID":
      return { ...state, chatId: action.chatId }

    case "SET_TAB_NUM":
      return { ...state, tabNum: action.tabNum }

    case "SET_STEP":
      return { ...state, step: action.step, error: null }

    case "SET_WAYBILL":
      return { ...state, waybill: action.waybill }

    case "SET_ERROR":
      return { ...state, error: action.error }

    case "TOGGLE_CATEGORY": {
      const { selectedCategories } = state.noAdmissionDraft
      const exists = selectedCategories.includes(action.category)
      return {
        ...state,
        noAdmissionDraft: {
          ...state.noAdmissionDraft,
          selectedCategories: exists
            ? selectedCategories.filter((c) => c !== action.category)
            : [...selectedCategories, action.category],
        },
      }
    }

    case "SET_NO_ADMISSION_COMMENT":
      return {
        ...state,
        noAdmissionDraft: {
          ...state.noAdmissionDraft,
          comment: action.comment,
        },
      }

    case "SET_NO_ADMISSION_PHOTOS":
      return {
        ...state,
        noAdmissionDraft: {
          ...state.noAdmissionDraft,
          photos: action.photos,
        },
      }

    case "UPDATE_NO_ADMISSION_PHOTO":
      return {
        ...state,
        noAdmissionDraft: {
          ...state.noAdmissionDraft,
          photos: state.noAdmissionDraft.photos.map((p) => (p.id === action.id ? { ...p, ...action.updates } : p)),
        },
      }

    case "SET_ACCIDENT_COMMENT":
      return {
        ...state,
        accidentDraft: {
          ...state.accidentDraft,
          comment: action.comment,
        },
      }

    case "SET_ACCIDENT_PHOTOS":
      return {
        ...state,
        accidentDraft: {
          ...state.accidentDraft,
          photos: action.photos,
        },
      }

    case "UPDATE_ACCIDENT_PHOTO":
      return {
        ...state,
        accidentDraft: {
          ...state.accidentDraft,
          photos: state.accidentDraft.photos.map((p) => (p.id === action.id ? { ...p, ...action.updates } : p)),
        },
      }

    case "RESET":
      return {
        ...initialState,
        chatId: state.chatId, // preserve chatId
      }

    default:
      return state
  }
}

export function useWorkflow() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setChatId = useCallback((chatId: string) => {
    dispatch({ type: "SET_CHAT_ID", chatId })
  }, [])

  const setTabNum = useCallback((tabNum: string) => {
    dispatch({ type: "SET_TAB_NUM", tabNum })
  }, [])

  const setStep = useCallback((step: WorkflowStep) => {
    dispatch({ type: "SET_STEP", step })
  }, [])

  const setWaybill = useCallback((waybill: WaybillDTO) => {
    dispatch({ type: "SET_WAYBILL", waybill })
  }, [])

  const setError = useCallback((error: string | null) => {
    dispatch({ type: "SET_ERROR", error })
  }, [])

  const toggleCategory = useCallback((category: NoAdmissionCategory) => {
    dispatch({ type: "TOGGLE_CATEGORY", category })
  }, [])

  const setNoAdmissionComment = useCallback((comment: string) => {
    dispatch({ type: "SET_NO_ADMISSION_COMMENT", comment })
  }, [])

  const setNoAdmissionPhotos = useCallback((photos: PhotoUpload[]) => {
    dispatch({ type: "SET_NO_ADMISSION_PHOTOS", photos })
  }, [])

  const updateNoAdmissionPhoto = useCallback((id: string, updates: Partial<PhotoUpload>) => {
    dispatch({ type: "UPDATE_NO_ADMISSION_PHOTO", id, updates })
  }, [])

  const setAccidentComment = useCallback((comment: string) => {
    dispatch({ type: "SET_ACCIDENT_COMMENT", comment })
  }, [])

  const setAccidentPhotos = useCallback((photos: PhotoUpload[]) => {
    dispatch({ type: "SET_ACCIDENT_PHOTOS", photos })
  }, [])

  const updateAccidentPhoto = useCallback((id: string, updates: Partial<PhotoUpload>) => {
    dispatch({ type: "UPDATE_ACCIDENT_PHOTO", id, updates })
  }, [])

  const reset = useCallback(() => {
    dispatch({ type: "RESET" })
  }, [])

  return {
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
  }
}
