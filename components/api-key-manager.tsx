'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Eye, EyeOff, Plus } from 'lucide-react'
import type { Provider } from '@/lib/storage'
import {
  getAllApiKeys,
  getApiKey,
  getSelectedKeyId,
  setSelectedKeyId,
  addApiKey,
  removeApiKey,
  updateApiKeyName,
  type ApiKeyEntry,
} from '@/lib/storage'

interface ApiKeyManagerProps {
  provider: Provider
  onKeyChange?: (hasKey: boolean) => void
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({
  provider,
  onKeyChange,
}) => {
  const [apiKeys, setApiKeys] = useState<ApiKeyEntry[]>([])
  const [selectedKeyId, setSelectedKeyIdState] = useState<string | null>(null)
  const [newKey, setNewKey] = useState<string>('')
  const [newKeyName, setNewKeyName] = useState<string>('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showKey, setShowKey] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    loadKeys()
  }, [provider])

  const loadKeys = () => {
    const keys = getAllApiKeys(provider)
    setApiKeys(keys)
    const selected = getSelectedKeyId(provider)
    setSelectedKeyIdState(selected || (keys.length > 0 ? keys[0].id : null))
    
    if (selected && keys.find(k => k.id === selected)) {
      setSelectedKeyId(provider, selected)
    } else if (keys.length > 0) {
      setSelectedKeyId(provider, keys[0].id)
      setSelectedKeyIdState(keys[0].id)
    }
    
    onKeyChange?.(keys.length > 0)
  }

  const handleAddKey = () => {
    if (newKey.trim()) {
      const keyId = addApiKey(provider, newKey.trim(), newKeyName.trim() || undefined)
      setNewKey('')
      setNewKeyName('')
      setShowAddForm(false)
      loadKeys()
      setSelectedKeyIdState(keyId)
      onKeyChange?.(true)
    }
  }

  const handleDeleteKey = (keyId: string) => {
    if (confirm('Are you sure you want to delete this API key?')) {
      removeApiKey(provider, keyId)
      const remainingKeys = getAllApiKeys(provider)
      loadKeys()
      if (remainingKeys.length === 0) {
        onKeyChange?.(false)
      }
    }
  }

  const handleSelectKey = (keyId: string) => {
    setSelectedKeyId(provider, keyId)
    setSelectedKeyIdState(keyId)
  }

  const toggleShowKey = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const currentKey = selectedKeyId ? getApiKey(provider, selectedKeyId) : null

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white dark:text-black">
        {provider.charAt(0).toUpperCase() + provider.slice(1)} API Keys
      </label>

      {/* Key Selection Dropdown */}
      {apiKeys.length > 0 && (
        <div className="space-y-2">
          <select
            value={selectedKeyId || ''}
            onChange={(e) => handleSelectKey(e.target.value)}
            className="w-full px-3 py-2 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-black/30 focus:border-white/30 dark:focus:border-black/30 text-white dark:text-black appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: 'right 0.5rem center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: '1.5em 1.5em',
              paddingRight: '2.5rem',
            }}
          >
            {apiKeys.map((key) => (
              <option key={key.id} value={key.id} className="bg-black text-white dark:bg-white dark:text-black">
                {key.name}
              </option>
            ))}
          </select>

          {/* Show selected key and delete button */}
          {selectedKeyId && (
            <div className="flex gap-2">
              <input
                type="text"
                value={showKey[selectedKeyId] ? currentKey || '' : '•'.repeat(20)}
                readOnly
                className="flex-1 px-3 py-2 backdrop-blur-md bg-white/5 dark:bg-black/5 border border-white/10 dark:border-black/10 rounded-xl text-white/80 dark:text-black/80 text-sm"
              />
              <button
                type="button"
                onClick={() => toggleShowKey(selectedKeyId)}
                className="p-2 backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white dark:text-black rounded-xl border border-white/20 dark:border-black/20 transition-all duration-200 flex items-center justify-center"
                title={showKey[selectedKeyId] ? 'Hide key' : 'Show key'}
              >
                {showKey[selectedKeyId] ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDeleteKey(selectedKeyId)}
                className="p-2 backdrop-blur-md bg-red-500/20 dark:bg-red-500/20 hover:bg-red-500/30 dark:hover:bg-red-500/30 text-white dark:text-black rounded-xl border border-red-500/30 dark:border-red-500/30 transition-all duration-200 flex items-center justify-center"
                title="Delete key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add New Key Form */}
      {showAddForm ? (
        <div className="space-y-2 p-3 backdrop-blur-md bg-white/5 dark:bg-black/5 rounded-xl border border-white/10 dark:border-black/10">
          <input
            type="text"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            placeholder="Key name (optional)"
            className="w-full px-3 py-2 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-xl text-white dark:text-black placeholder:text-white/50 dark:placeholder:text-black/50 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="password"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder={`Enter ${provider} API key`}
              className="flex-1 px-3 py-2 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-black/30 focus:border-white/30 dark:focus:border-black/30 text-white dark:text-black placeholder:text-white/50 dark:placeholder:text-black/50 text-sm"
            />
            <button
              type="button"
              onClick={handleAddKey}
              disabled={!newKey.trim()}
              className="p-2 backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white dark:text-black rounded-xl transition-all duration-200 border border-white/20 dark:border-black/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center"
              title="Add key"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false)
                setNewKey('')
                setNewKeyName('')
              }}
              className="p-2 backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white dark:text-black rounded-xl transition-all duration-200 border border-white/20 dark:border-black/20 shadow-lg flex items-center justify-center"
              title="Cancel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="w-full px-4 py-2 backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white dark:text-black rounded-xl font-medium transition-all duration-200 border border-white/20 dark:border-black/20 shadow-lg text-sm"
        >
          + Add New Key
        </button>
      )}
    </div>
  )
}

