import { useState } from 'react';
export default function App() {
    const [topic, setTopic] = useState('');
    const [affModel, setAffModel] = useState('openai');
    const [negModel, setNegModel] = useState('anthropic');
    return (<div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-indigo-600 mb-6">
            🧠 AI Debate Arena
          </h1>
          
          <div className="space-y-6">
            {/* Topic Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Debate Topic
              </label>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g., Cities should ban gasoline leaf blowers" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"/>
            </div>

            {/* Affirmative Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affirmative Model
              </label>
              <select value={affModel} onChange={(e) => setAffModel(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="openai">OpenAI GPT-5</option>
                <option value="anthropic">Claude Sonnet 4.5</option>
                <option value="gemini">Gemini 2.5 Pro</option>
              </select>
            </div>

            {/* Negative Model */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Negative Model
              </label>
              <select value={negModel} onChange={(e) => setNegModel(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500">
                <option value="openai">OpenAI GPT-5</option>
                <option value="anthropic">Claude Sonnet 4.5</option>
                <option value="gemini">Gemini 2.5 Pro</option>
              </select>
            </div>

            {/* Run Button */}
            <button onClick={() => alert('API not connected yet!')} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              🎭 Run Debate
            </button>
          </div>
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=App.js.map