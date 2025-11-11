import { useState } from 'react'
import type { SavedDebate } from '../types'
import { getSavedDebates, deleteDebate, clearAllDebates, formatTimestamp, exportAsMarkdown, downloadFile } from '../utils'

type Props = {
  isOpen: boolean
  onClose: () => void
  onLoadDebate: (debate: SavedDebate) => void
  theme: 'light' | 'dark'
}

export default function HistorySidebar({ isOpen, onClose, onLoadDebate, theme }: Props) {
  const [debates, setDebates] = useState<SavedDebate[]>(getSavedDebates())
  const [filter, setFilter] = useState<'all' | 'debate' | 'discussion'>('all')

  const handleDelete = (id: string) => {
    if (confirm('Delete this debate?')) {
      deleteDebate(id)
      setDebates(getSavedDebates())
    }
  }

  const handleClearAll = () => {
    if (confirm('Delete all debate history? This cannot be undone.')) {
      clearAllDebates()
      setDebates([])
    }
  }

  const handleExport = (debate: SavedDebate) => {
    const md = exportAsMarkdown(debate)
    const filename = `debate-${debate.id}.md`
    downloadFile(md, filename)
  }

  const filtered = debates.filter(d => filter === 'all' || d.mode === filter)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-80 z-50 shadow-2xl overflow-hidden flex flex-col ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className="text-lg font-semibold">📚 History</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition ${
              theme === 'dark' 
                ? 'hover:bg-gray-800' 
                : 'hover:bg-gray-100'
            }`}
          >
            ✕
          </button>
        </div>

        {/* Filter tabs */}
        <div className={`flex gap-2 p-3 border-b ${
          theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {(['all', 'debate', 'discussion'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                filter === f
                  ? 'bg-orange-600 text-white'
                  : theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'debate' ? '🎭 Debates' : '💬 Discussions'}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="text-4xl mb-3">📭</div>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                No debates yet
              </p>
            </div>
          ) : (
            <div className="space-y-2 p-3">
              {filtered.map(debate => {
                const topic = debate.mode === 'debate' 
                  ? debate.debateResult?.topic 
                  : debate.discussionResult?.topic
                
                return (
                  <div
                    key={debate.id}
                    className={`p-3 rounded-lg border cursor-pointer transition ${
                      theme === 'dark'
                        ? 'bg-gray-800 border-gray-700 hover:bg-gray-750'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                    onClick={() => onLoadDebate(debate)}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium mb-1">
                          {debate.mode === 'debate' ? '🎭 Debate' : '💬 Discussion'}
                        </div>
                        <div className={`text-sm font-medium line-clamp-2 ${
                          theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                        }`}>
                          {topic}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {formatTimestamp(debate.timestamp)}
                      </span>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleExport(debate)
                          }}
                          className={`p-1.5 rounded text-xs transition ${
                            theme === 'dark'
                              ? 'hover:bg-gray-700'
                              : 'hover:bg-gray-200'
                          }`}
                          title="Export"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDelete(debate.id)
                          }}
                          className={`p-1.5 rounded text-xs transition ${
                            theme === 'dark'
                              ? 'hover:bg-red-900/50 text-red-400'
                              : 'hover:bg-red-100 text-red-600'
                          }`}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {debates.length > 0 && (
          <div className={`p-3 border-t ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={handleClearAll}
              className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                theme === 'dark'
                  ? 'bg-red-900/50 text-red-400 hover:bg-red-900'
                  : 'bg-red-50 text-red-600 hover:bg-red-100'
              }`}
            >
              Clear All History
            </button>
          </div>
        )}
      </div>
    </>
  )
}
