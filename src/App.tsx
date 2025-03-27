
import { useState, useEffect, useCallback } from 'react'
import { Play, Pause, RefreshCw } from 'lucide-react'
import './App.css'

type TimerMode = 'work' | 'break'

export default function App() {
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<TimerMode>('work')
  const [sessions, setSessions] = useState(0)

  const toggleTimer = () => setIsRunning(prev => !prev)
  
  const resetTimer = useCallback(() => {
    setIsRunning(false)
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60)
  }, [mode])

  const switchMode = useCallback(() => {
    const newMode = mode === 'work' ? 'break' : 'work'
    setMode(newMode)
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60)
    setIsRunning(false)
    if (newMode === 'work') {
      setSessions(s => s + 1)
    }
  }, [mode])

  useEffect(() => {
    let interval: number | undefined

    if (isRunning && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(time => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play()
      switchMode()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft, switchMode])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = mode === 'work' 
    ? (1 - timeLeft / (25 * 60)) * 100
    : (1 - timeLeft / (5 * 60)) * 100

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-700 ${
      mode === 'work' ? 'bg-rose-50' : 'bg-emerald-50'
    }`}>
      <div className="w-full max-w-md mx-auto p-8">
        <div className="relative aspect-square">
          {/* Progress Circle */}
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className="stroke-gray-200 fill-none"
              strokeWidth="5%"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              className={`${
                mode === 'work' ? 'stroke-rose-500' : 'stroke-emerald-500'
              } fill-none transition-all duration-300`}
              strokeWidth="5%"
              strokeDasharray={`${progress} 100`}
              style={{
                transition: 'stroke-dasharray 0.3s ease'
              }}
            />
          </svg>
          
          {/* Timer Display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-6xl font-bold mb-2 transition-colors ${
              mode === 'work' ? 'text-rose-600' : 'text-emerald-600'
            }`}>
              {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
            </div>
            <div className={`text-xl font-medium capitalize transition-colors ${
              mode === 'work' ? 'text-rose-500' : 'text-emerald-500'
            }`}>
              {mode} Time
            </div>
            {sessions > 0 && (
              <div className="text-sm text-gray-500 mt-2">
                Sessions completed: {sessions}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={toggleTimer}
            className={`p-4 rounded-full transition-all transform hover:scale-110 ${
              mode === 'work'
                ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
            }`}
          >
            {isRunning ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={resetTimer}
            className={`p-4 rounded-full transition-all transform hover:scale-110 ${
              mode === 'work'
                ? 'bg-rose-100 text-rose-600 hover:bg-rose-200'
                : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200'
            }`}
          >
            <RefreshCw size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}