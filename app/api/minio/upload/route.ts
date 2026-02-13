import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  // Simulate upload delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Generate mock fileName
    const fileName = `uploads/${Date.now()}_${file.name}`

    console.log("[v0] MinIO upload received:", { fileName, size: file.size, type: file.type })

    return NextResponse.json({ fileName, success: true })
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
