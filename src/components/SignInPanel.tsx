import { useState } from 'react'
import { useAuth } from '../auth/AuthContext'

type Props = {
  theme: 'light' | 'dark'
}

type AuthMode = 'signin' | 'signup'

export default function SignInPanel({ theme }: Props) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, available } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<AuthMode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (!available) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className={`p-6 rounded-2xl border text-center ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <h2 className="text-xl font-semibold mb-2">Authentication not configured</h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Set Firebase env variables to enable Sign in (see .env.example).
          </p>
        </div>
      </div>
    )
  }

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password)
      } else {
        await signInWithEmail(email, password)
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className={`p-6 rounded-2xl border w-full max-w-md ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
      }`}>
        <h2 className="text-xl font-semibold mb-4 text-center">Welcome to AI Debate Arena</h2>
        
        {error && (
          <div className={`mb-3 p-3 rounded-lg text-sm ${
            theme === 'dark' ? 'bg-red-900/30 text-red-400' : 'bg-red-50 text-red-600'
          }`}>{error}</div>
        )}

        {/* Tabs */}
        <div className={`flex gap-2 mb-4 p-1 rounded-lg ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <button
            onClick={() => setMode('signin')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === 'signin'
                ? theme === 'dark'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
                : theme === 'dark'
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
              mode === 'signup'
                ? theme === 'dark'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-900 shadow-sm'
                : theme === 'dark'
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3 mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={`w-full px-4 py-2.5 rounded-lg border transition ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400'
            } focus:outline-none`}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className={`w-full px-4 py-2.5 rounded-lg border transition ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-gray-600'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-gray-400'
            } focus:outline-none`}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className={`absolute inset-0 flex items-center ${
            theme === 'dark' ? 'text-gray-700' : 'text-gray-300'
          }`}>
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className={`px-2 ${
              theme === 'dark' ? 'bg-gray-900 text-gray-500' : 'bg-white text-gray-500'
            }`}>or</span>
          </div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={async () => {
            try {
              setError(null)
              await signInWithGoogle()
            } catch (e: any) {
              setError(e?.message || 'Failed to sign in with Google')
            }
          }}
          className={`w-full py-2.5 rounded-lg border font-medium transition flex items-center justify-center gap-2 ${
            theme === 'dark'
              ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}
