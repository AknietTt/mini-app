import { type NextRequest, NextResponse } from "next/server"

// URL вебхуков n8n
const N8N_WEBHOOK_GET = process.env.N8N_WEBHOOK_GET || "https://n8n.avtopark1.kz:8443/webhook/tg-from-gateway_get"
const N8N_WEBHOOK_POST = process.env.N8N_WEBHOOK_POST || "https://n8n.avtopark1.kz:8443/webhook/tg-from-gateway"

// Bearer токен для авторизации
const API_TOKEN = process.env.N8N_WEBHOOK_TOKEN || "ew0KImFsZyI6ICJIUzI1NiIsDQoidHlwIjogIkpXVCINCn0.ew0KImF1ZCI6ICJ1YXQiLA0KInRva2VuX3R5cGUiOiAiYWNjZXNzIiwNCiJuYmYiOiAxNzY0MzY0NTkwLA0KInN1YiI6ICLQmNC90YLQtdCz0YDQsNGG0LjRj9Ci0LXQu9C10LPRgNCw0LwiLA0KImV4cCI6IDExNzY0MzY0NTg5LA0KImlhdCI6IDE3NjQzNjQ1OTAsDQoiaXNzIjogInNzbCINCn0.5uzkBxAaZ0G_UeloEevHa_h1N3iUPVPsJcluCOGCFpM"

// POST запрос - получение путевого листа (через n8n)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Определяем, какой вебхук использовать по наличию параметров запроса
    const isGetRequest = body.tab_num && body.date && !body.PL_ID

    const webhookUrl = isGetRequest ? N8N_WEBHOOK_GET : N8N_WEBHOOK_POST

    // Выполняем запрос к n8n вебхуку
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("n8n webhook error:", response.status, errorText)
      return NextResponse.json(
        { error: errorText || `n8n webhook error: ${response.status}` },
        { status: response.status },
      )
    }

    // n8n может вернуть JSON ответ
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return NextResponse.json(data)
    }

    // Если ответ пустой, возвращаем успешный статус
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

