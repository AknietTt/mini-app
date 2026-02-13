// Waybill DTO from API response (плоская структура)
export interface WaybillAPIResponse {
  PL_ID: string
  PL_Number: string
  Date: string
  TabNo: string // Табельный номер водителя
  FIO: string // ФИО водителя
  GarageNo: string // Гаражевый номер
  Plate: string // Гос. номер
  Model: string // Модель ТС
  Route: string
  ExitCode: number
  Reasons: string[] // Список возможных причин не выхода для выбора пользователем
  DTP: boolean // Признак ДТП
  Status: string
  Status_ID: string
  CanRelease: boolean
}

// Waybill DTO for internal use
export interface WaybillDTO {
  PL_ID: string
  PL_Number: string
  exitCode: number | null
  type: "departure" | "arrival" // выезд/заезд
  driver: {
    tabNum: string
    fullName: string
  }
  bus: {
    garageNum: string
    govNum: string
    model: string
  }
  route: string
  reasons: string[] // Список возможных причин не выхода
  wasAccident: boolean // Признак ДТП (DTP)
}

// Photo upload state
export interface PhotoUpload {
  id: string
  file: File
  preview: string
  status: "pending" | "uploading" | "done" | "error"
  progress: number
  fileName?: string // returned from MinIO
  error?: string
}

// Categories for "Не допуск" form
export type NoAdmissionCategory = "engine" | "brakes" | "electrical" | "chassis" | "body"

export const CATEGORY_LABELS: Record<NoAdmissionCategory, string> = {
  engine: "ДВС",
  brakes: "Тормозная система",
  electrical: "Электрика",
  chassis: "Ходовая часть",
  body: "Кузов/Салон",
}

// Form drafts
export interface NoAdmissionDraft {
  selectedCategories: NoAdmissionCategory[]
  comment: string
  photos: PhotoUpload[]
}

export interface AccidentDraft {
  comment: string
  photos: PhotoUpload[]
}

// Workflow steps
export type WorkflowStep =
  | "enterTabNumber"
  | "loadingWaybill"
  | "waybillCard"
  | "departureNoAdmissionForm"
  | "arrivalAccidentForm"
  | "submitting"
  | "done"

// Workflow state
export interface WorkflowState {
  step: WorkflowStep
  chatId: string | null
  tabNum: string
  waybill: WaybillDTO | null
  noAdmissionDraft: NoAdmissionDraft
  accidentDraft: AccidentDraft
  error: string | null
}

// API payloads
export interface WaybillPostPayload {
  chat_id: string | number
  event_id: "mechanic"
  type: "departure" | "arrival"
  PL_ID: string
  status: boolean
  tech_status?: boolean
  external_inspection?: boolean
  exit_line?: boolean
  reason?: string[] // Массив причин которые выбрал пользователь
  comment?: string // Текстовый комментарий
  photo?: string[] // Массив имен файлов из MinIO
}
