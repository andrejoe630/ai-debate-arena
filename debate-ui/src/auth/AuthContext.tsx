import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, googleProvider, isAuthConfigured } from '../lib/firebase'
import type { User } from 'firebase/auth'
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as fbSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth'

export type AuthContextValue = {
  user: User | null
  loading: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  available: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(isAuthConfigured)

  useEffect(() => {
    if (!isAuthConfigured || !auth) return
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    available: isAuthConfigured,
    signInWithGoogle: async () => {
      if (!auth || !googleProvider) throw new Error('Auth not configured')
      await signInWithPopup(auth, googleProvider)
    },
    signInWithEmail: async (email: string, password: string) => {
      if (!auth) throw new Error('Auth not configured')
      await signInWithEmailAndPassword(auth, email, password)
    },
    signUpWithEmail: async (email: string, password: string) => {
      if (!auth) throw new Error('Auth not configured')
      await createUserWithEmailAndPassword(auth, email, password)
    },
    signOut: async () => {
      if (!auth) return
      await fbSignOut(auth)
    }
  }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
