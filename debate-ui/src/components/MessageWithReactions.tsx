import type { Message } from '../types'

type Props = {
  message: Message
  theme: 'light' | 'dark'
}

export default function MessageWithReactions({ message, theme }: Props) {

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
        </div>
      </div>
    </div>
  )
}
