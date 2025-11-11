import { useState } from 'react'

type Props = {
  content: string
  theme: 'light' | 'dark'
}

export default function InfoTooltip({ content, theme }: Props) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className={`ml-1.5 w-4 h-4 rounded-full text-xs flex items-center justify-center transition ${
          theme === 'dark'
            ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 hover:text-gray-300'
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-700'
        }`}
        type="button"
      >
        ?
      </button>
      
      {isVisible && (
        <div
          className={`absolute left-0 top-6 z-50 w-64 p-3 rounded-lg shadow-lg text-xs leading-relaxed ${
            theme === 'dark'
              ? 'bg-gray-800 text-gray-200 border border-gray-700'
              : 'bg-white text-gray-700 border border-gray-200'
          }`}
        >
          {content}
        </div>
      )}
    </div>
  )
}
