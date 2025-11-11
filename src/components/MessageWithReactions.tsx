import type { Message, MessageReactions } from '../types'

type Props = {
  message: Message
  index: number
  reactions: MessageReactions | undefined
  onReact: (index: number, reaction: keyof MessageReactions) => void
  theme: 'light' | 'dark'
}

export default function MessageWithReactions({ message, index, reactions, onReact, theme }: Props) {
  const reactionEmojis: Array<{ key: keyof MessageReactions, emoji: string }> = [
    { key: 'fire', emoji: '🔥' },
    { key: 'thinking', emoji: '🤔' },
    { key: 'clap', emoji: '👏' }
  ]

  return (
    <div className="animate-fadeIn">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
          message.role === 'affirmative' 
            ? 'bg-green-500' 
            : message.role === 'negative' 
            ? 'bg-red-500' 
            : 'bg-purple-500'
        }`}>
          {message.role === 'affirmative' ? '✓' : message.role === 'negative' ? '✗' : '⚖'}
        </div>
        
        {/* Message content */}
        <div className="flex-1 space-y-2">
          <div className="flex items-baseline gap-2">
            <span className={`font-semibold ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
            }`}>
              {message.role === 'affirmative' ? 'Affirmative' : message.role === 'negative' ? 'Negative' : 'Moderator'}
            </span>
            <span className={`text-xs ${
              theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
            }`}>
              {message.model} · Round {message.round}
            </span>
          </div>
          <div className={`leading-relaxed whitespace-pre-wrap ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-800'
          }`}>
            {message.text}
          </div>
          
          {/* Reactions */}
          <div className="flex gap-2 pt-2">
            {reactionEmojis.map(({ key, emoji }) => (
              <button
                key={key}
                onClick={() => onReact(index, key)}
                className={`px-2 py-1 rounded-lg text-sm transition ${
                  reactions?.[key]
                    ? theme === 'dark'
                      ? 'bg-orange-900/30 border border-orange-700'
                      : 'bg-orange-50 border border-orange-200'
                    : theme === 'dark'
                    ? 'bg-gray-800 border border-gray-700 hover:bg-gray-750'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {emoji} {reactions?.[key] || ''}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
