export interface WaybillData {
    id: string
    date: string
    route: string
    vehicleNumber: string
    driver: string
    operationType: "departure" | "arrival"
    isIncident: boolean
    isNoRelease: boolean
  }
  
  export interface TechReason {
    id: number
    ru: string
    kz?: string
  }
  
  export interface TechCategory {
    id: string
    name: string
    nameKz?: string
    reasons: TechReason[]
  }
  
  export interface PhotoItem {
    id: string
    fileName: string
    url: string
    uploading?: boolean
    progress?: number
    error?: boolean
  }
  
  export interface ExternalConditionData {
    dirtySalon: boolean
    dirtyBody: boolean
    comment: string
    photos: PhotoItem[]
  }
  
  export interface TechnicalConditionData {
    categoryId: string | null
    reasons: TechReason[]
    comment: string
    photos: PhotoItem[]
  }
  
  export interface FormState {
    external: ExternalConditionData
    technical: TechnicalConditionData
  }
  
  export type AppState = "loading" | "ready" | "draft" | "uploading" | "submitting" | "success" | "error"
  