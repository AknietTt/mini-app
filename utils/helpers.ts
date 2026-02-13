import { CATEGORY_LABELS, type NoAdmissionCategory } from "@/types"

export function cn(...classes: (string | undefined | null | false | Record<string, boolean>)[]): string {
  const result: string[] = []
  for (const cls of classes) {
    if (!cls) continue
    if (typeof cls === "string") {
      result.push(cls)
    } else if (typeof cls === "object") {
      const objClasses = Object.entries(cls)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key)
      result.push(...objClasses)
    }
  }
  return result.join(" ")
}

export function buildReasonText(categories: NoAdmissionCategory[], comment: string): string {
  const categoryNames = categories.map((c) => CATEGORY_LABELS[c])
  const categoryText = categoryNames.join(", ")

  if (comment.trim()) {
    return `${categoryText}. ${comment.trim()}`
  }

  return categoryText
}

// Преобразует категории в массив строк для API
export function categoriesToReasonArray(categories: NoAdmissionCategory[]): string[] {
  return categories.map((c) => CATEGORY_LABELS[c])
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function generatePhotoId(): string {
  return `photo_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}
