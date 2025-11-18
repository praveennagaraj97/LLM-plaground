export type Provider = 'gemini' | 'gpt' | 'claude'

export interface ApiKeyEntry {
  id: string
  name: string
  key: string
  createdAt: number
}

const getStorageKey = (provider: Provider): string => {
  return `api_keys_${provider}`
}

export const getAllApiKeys = (provider: Provider): ApiKeyEntry[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = sessionStorage.getItem(getStorageKey(provider))
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export const getApiKey = (provider: Provider, keyId?: string): string | null => {
  if (typeof window === 'undefined') return null
  const keys = getAllApiKeys(provider)
  
  if (keyId) {
    const entry = keys.find(k => k.id === keyId)
    return entry?.key || null
  }
  
  // Return the first key if no specific key is requested
  return keys.length > 0 ? keys[0].key : null
}

export const getSelectedKeyId = (provider: Provider): string | null => {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(`selected_key_${provider}`)
}

export const setSelectedKeyId = (provider: Provider, keyId: string | null): void => {
  if (typeof window === 'undefined') return
  if (keyId) {
    sessionStorage.setItem(`selected_key_${provider}`, keyId)
  } else {
    sessionStorage.removeItem(`selected_key_${provider}`)
  }
}

export const addApiKey = (provider: Provider, key: string, name?: string): string => {
  if (typeof window === 'undefined') return ''
  const keys = getAllApiKeys(provider)
  const newEntry: ApiKeyEntry = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    name: name || `Key ${keys.length + 1}`,
    key: key.trim(),
    createdAt: Date.now(),
  }
  keys.push(newEntry)
  sessionStorage.setItem(getStorageKey(provider), JSON.stringify(keys))
  
  // Auto-select the new key if it's the first one
  if (keys.length === 1) {
    setSelectedKeyId(provider, newEntry.id)
  }
  
  return newEntry.id
}

export const removeApiKey = (provider: Provider, keyId: string): void => {
  if (typeof window === 'undefined') return
  const keys = getAllApiKeys(provider)
  const filtered = keys.filter(k => k.id !== keyId)
  sessionStorage.setItem(getStorageKey(provider), JSON.stringify(filtered))
  
  // If the removed key was selected, select the first available key or clear selection
  const selectedId = getSelectedKeyId(provider)
  if (selectedId === keyId) {
    if (filtered.length > 0) {
      setSelectedKeyId(provider, filtered[0].id)
    } else {
      setSelectedKeyId(provider, null)
    }
  }
}

export const updateApiKeyName = (provider: Provider, keyId: string, name: string): void => {
  if (typeof window === 'undefined') return
  const keys = getAllApiKeys(provider)
  const updated = keys.map(k => k.id === keyId ? { ...k, name: name.trim() } : k)
  sessionStorage.setItem(getStorageKey(provider), JSON.stringify(updated))
}

// System Prompt Storage
export const getSystemPrompt = (provider: Provider): string => {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem(`system_prompt_${provider}`) || ''
}

export const setSystemPrompt = (provider: Provider, prompt: string): void => {
  if (typeof window === 'undefined') return
  if (prompt.trim()) {
    sessionStorage.setItem(`system_prompt_${provider}`, prompt.trim())
  } else {
    sessionStorage.removeItem(`system_prompt_${provider}`)
  }
}

