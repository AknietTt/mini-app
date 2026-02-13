"use client"

import { useEffect, useState } from "react"

interface TelegramInitData {
  chatId: string | null
  isReady: boolean
}

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  initDataUnsafe?: {
    user?: {
      id?: number
    }
  }
}

interface TelegramWindow extends Window {
  Telegram?: {
    WebApp?: TelegramWebApp
  }
}

export function useTelegramInit(): TelegramInitData {
  const [data, setData] = useState<TelegramInitData>({
    chatId: null,
    isReady: false,
  })

  useEffect(() => {
    // Check if running in Telegram WebApp
    const tg = (window as TelegramWindow).Telegram?.WebApp

    if (tg) {
      tg.ready()
      tg.expand()

      // Extract chat_id from initData
      const initData = tg.initDataUnsafe
      const chatId = initData?.user?.id?.toString() || null

      // Use setTimeout to avoid synchronous state update in effect
      setTimeout(() => {
        setData({ chatId, isReady: true })
      }, 0)
    } else {
      // Development mode - use mock chatId
      setTimeout(() => {
        setData({ chatId: "dev_123456", isReady: true })
      }, 0)
    }
  }, [])

  return data
}
