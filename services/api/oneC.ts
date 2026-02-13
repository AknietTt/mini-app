import type { WaybillDTO, WaybillPostPayload, WaybillAPIResponse } from "@/types"

const API_BASE = "https://n8n.avtopark1.kz:8443/webhook" // proxy to avoid CORS

export async function getWaybill(tabNum: string, date: string): Promise<WaybillDTO> {
  // Используем POST запрос через n8n вебхук
  const response = await fetch(`${API_BASE}/tg-from-gateway_get`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tab_num: tabNum,
      event_id: "mechanic",
      date,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Ошибка загрузки путевого листа")
  }

  const data = await response.json()
  // API возвращает объект напрямую (не массив)
  const waybillData: WaybillAPIResponse = Array.isArray(data) ? data[0] : data

  // Определяем type по Status или ExitCode
  // Если в статусе есть "выезд" - это departure, если "заезд" - arrival
  const status = waybillData.Status?.toLowerCase() || ""
  const statusId = waybillData.Status_ID?.toLowerCase() || ""
  const isOnLine = status.includes("на линии") || statusId.includes("налинии")
  const isArrival = status.includes("заезд") || statusId.includes("заезд") || status.includes("arrival")
  const type: "departure" | "arrival" = isOnLine || isArrival ? "arrival" : "departure"

  // Преобразуем в внутренний формат
  return {
    PL_ID: waybillData.PL_ID,
    PL_Number: waybillData.PL_Number,
    exitCode: waybillData.ExitCode ?? null,
    type,
    driver: {
      tabNum: waybillData.TabNo,
      fullName: waybillData.FIO,
    },
    bus: {
      garageNum: waybillData.GarageNo,
      govNum: waybillData.Plate,
      model: waybillData.Model,
    },
    route: waybillData.Route,
    reasons: waybillData.Reasons || [],
    wasAccident: waybillData.DTP || false,
  }
}

export async function postWaybill(payload: WaybillPostPayload): Promise<void> {
  const response = await fetch(`${API_BASE}/tg_waybill`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(error || "Ошибка отправки данных")
  }
}
