import type { ModelKey } from '../types'
import { getModelStats, clearStats } from '../utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  theme: 'light' | 'dark'
}

export default function StatsModal({ isOpen, onClose, theme }: Props) {
  const stats = getModelStats()
  
  const handleClear = () => {
    if (confirm('Clear all statistics? This cannot be undone.')) {
      clearStats()
      window.location.reload()
    }
  }

  if (!isOpen) return null

  const modelNames: Record<ModelKey, string> = {
    openai: 'GPT-5.1',
    anthropic: 'Claude Sonnet 4.5',
    gemini: 'Gemini 2.5 Flash'
  }

  const modelEmojis: Record<ModelKey, string> = {
    openai: '🔵',
    anthropic: '🟠',
    gemini: '🟢'
  }

  const sortedModels = (Object.keys(stats) as ModelKey[]).sort((a, b) => 
    stats[b].wins - stats[a].wins
  )

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden ${
            theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className="text-2xl font-bold">📊 Model Statistics</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {Object.values(stats).every(s => s.totalDebates === 0) ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                  No debate statistics yet. Run some debates to see performance!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Leaderboard */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">🏆 Leaderboard</h3>
                  <div className="space-y-3">
                    {sortedModels.map((model, idx) => {
                      const s = stats[model]
                      const winRate = s.totalDebates > 0 
                        ? ((s.wins / s.totalDebates) * 100).toFixed(1)
                        : '0.0'
                      
                      return (
                        <div 
                          key={model}
                          className={`p-4 rounded-xl border ${
                            theme === 'dark'
                              ? 'bg-gray-800 border-gray-700'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-bold text-gray-400">
                                #{idx + 1}
                              </span>
                              <span className="text-2xl">{modelEmojis[model]}</span>
                              <span className="font-semibold text-lg">
                                {modelNames[model]}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-orange-600">
                                {winRate}%
                              </div>
                              <div className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                win rate
                              </div>
                            </div>
                          </div>
                          
                          {/* Stats bar */}
                          <div className="flex gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                Wins:
                              </span>
                              <span className="font-semibold text-green-600">
                                {s.wins}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                Losses:
                              </span>
                              <span className="font-semibold text-red-600">
                                {s.losses}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                Ties:
                              </span>
                              <span className="font-semibold text-gray-600">
                                {s.ties}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 ml-auto">
                              <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                                Total:
                              </span>
                              <span className="font-semibold">
                                {s.totalDebates}
                              </span>
                            </div>
                          </div>
                          
                          {/* Visual bar */}
                          <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden flex">
                            {s.wins > 0 && (
                              <div 
                                className="bg-green-500"
                                style={{ width: `${(s.wins / s.totalDebates) * 100}%` }}
                              />
                            )}
                            {s.losses > 0 && (
                              <div 
                                className="bg-red-500"
                                style={{ width: `${(s.losses / s.totalDebates) * 100}%` }}
                              />
                            )}
                            {s.ties > 0 && (
                              <div 
                                className="bg-gray-400"
                                style={{ width: `${(s.ties / s.totalDebates) * 100}%` }}
                              />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={`p-4 border-t flex justify-between ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={handleClear}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                theme === 'dark'
                  ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              Clear Stats
            </button>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
