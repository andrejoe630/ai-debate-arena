import { useState } from 'react'
import type { DebateTopic } from '../types'
import { DEBATE_TOPICS, getRandomTopic } from '../topics'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSelectTopic: (topic: string) => void
  theme: 'light' | 'dark'
}

export default function TopicsBrowser({ isOpen, onClose, onSelectTopic, theme }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<DebateTopic['category'] | 'all'>('all')
  
  const categories: Array<{ key: DebateTopic['category'] | 'all', label: string, emoji: string }> = [
    { key: 'all', label: 'All', emoji: '🎯' },
    { key: 'philosophy', label: 'Philosophy', emoji: '🤔' },
    { key: 'technology', label: 'Technology', emoji: '💻' },
    { key: 'ethics', label: 'Ethics', emoji: '⚖️' },
    { key: 'science', label: 'Science', emoji: '🔬' },
    { key: 'politics', label: 'Politics', emoji: '🏛️' },
    { key: 'culture', label: 'Culture', emoji: '🎭' }
  ]
  
  const filteredTopics = selectedCategory === 'all'
    ? DEBATE_TOPICS
    : DEBATE_TOPICS.filter(t => t.category === selectedCategory)
  
  const getDifficultyColor = (difficulty: DebateTopic['difficulty']) => {
    const colors = {
      easy: theme === 'dark' ? 'text-green-400' : 'text-green-600',
      medium: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
      hard: theme === 'dark' ? 'text-red-400' : 'text-red-600'
    }
    return colors[difficulty]
  }

  const handleRandom = () => {
    const topic = getRandomTopic()
    onSelectTopic(topic.title)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] ${
            theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b flex items-center justify-between ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div>
              <h2 className="text-2xl font-bold mb-1">💡 Debate Topics</h2>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Choose from curated topics or get a random one
              </p>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              ✕
            </button>
          </div>

          {/* Categories */}
          <div className={`p-4 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3.5 py-2 rounded-md text-[13px] font-medium transition ${
                    selectedCategory === cat.key
                      ? 'bg-orange-600 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
              <button
                onClick={handleRandom}
                className={`px-3.5 py-2 rounded-md text-[13px] font-medium transition ${
                  theme === 'dark'
                    ? 'bg-purple-900/50 text-purple-400 hover:bg-purple-900'
                    : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                }`}
              >
                🎲 Random
              </button>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredTopics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => {
                    onSelectTopic(topic.title)
                    onClose()
                  }}
                  className={`p-4 rounded-xl border text-left transition ${
                    theme === 'dark'
                      ? 'bg-gray-800 border-gray-700 hover:bg-gray-750 hover:border-orange-500'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-orange-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`text-sm font-medium line-clamp-2 flex-1 ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}>
                      {topic.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                      {topic.category}
                    </span>
                    <span className={getDifficultyColor(topic.difficulty)}>
                      ● {topic.difficulty}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t flex justify-between items-center ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              {filteredTopics.length} topics available
            </span>
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
