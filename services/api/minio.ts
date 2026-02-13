const MINIO_API_URL = process.env.NEXT_PUBLIC_MINIO_API_URL || "http://192.168.100.30/api/minio/upload"

export interface UploadPhotoResult {
  fileName: string
}

export async function uploadPhoto(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<UploadPhotoResult> {
  const formData = new FormData()
  formData.append("file", file)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100)
          onProgress(percentComplete)
        }
      })
    }

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText) as UploadPhotoResult
          resolve(response)
        } catch (error) {
          reject(new Error("Ошибка парсинга ответа сервера"))
        }
      } else {
        reject(new Error(`Ошибка загрузки: ${xhr.statusText}`))
      }
    })

    xhr.addEventListener("error", () => {
      reject(new Error("Ошибка сети при загрузке файла"))
    })

    xhr.addEventListener("abort", () => {
      reject(new Error("Загрузка отменена"))
    })

    xhr.open("POST", MINIO_API_URL)
    xhr.send(formData)
  })
}
