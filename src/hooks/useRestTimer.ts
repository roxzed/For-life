import { useState, useEffect, useCallback, useRef } from 'react'

interface RestTimerState {
  timeLeft: number
  isRunning: boolean
  isComplete: boolean
  totalTime: number
}

export function useRestTimer() {
  const [state, setState] = useState<RestTimerState>({
    timeLeft: 0,
    isRunning: false,
    isComplete: false,
    totalTime: 0,
  })
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const startTimer = useCallback((seconds: number) => {
    clearTimer()
    setState({
      timeLeft: seconds,
      isRunning: true,
      isComplete: false,
      totalTime: seconds,
    })

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearTimer()
          // Vibrate on completion
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200])
          }
          return { ...prev, timeLeft: 0, isRunning: false, isComplete: true }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)
  }, [clearTimer])

  const pause = useCallback(() => {
    clearTimer()
    setState((prev) => ({ ...prev, isRunning: false }))
  }, [clearTimer])

  const resume = useCallback(() => {
    if (state.timeLeft <= 0) return
    setState((prev) => ({ ...prev, isRunning: true }))

    intervalRef.current = setInterval(() => {
      setState((prev) => {
        if (prev.timeLeft <= 1) {
          clearTimer()
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200])
          }
          return { ...prev, timeLeft: 0, isRunning: false, isComplete: true }
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 }
      })
    }, 1000)
  }, [clearTimer, state.timeLeft])

  const reset = useCallback(() => {
    clearTimer()
    setState({ timeLeft: 0, isRunning: false, isComplete: false, totalTime: 0 })
  }, [clearTimer])

  useEffect(() => {
    return () => clearTimer()
  }, [clearTimer])

  const progress = state.totalTime > 0 ? (state.totalTime - state.timeLeft) / state.totalTime : 0

  return {
    ...state,
    progress,
    startTimer,
    pause,
    resume,
    reset,
  }
}
