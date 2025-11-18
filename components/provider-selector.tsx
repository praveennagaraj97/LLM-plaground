'use client'

import type { Provider } from '@/lib/storage'

interface ProviderSelectorProps {
  selectedProvider: Provider
  onProviderChange: (provider: Provider) => void
}

export const ProviderSelector: React.FC<ProviderSelectorProps> = ({
  selectedProvider,
  onProviderChange,
}) => {
  const providers: { id: Provider; name: string }[] = [
    { id: 'gemini', name: 'Gemini' },
    { id: 'gpt', name: 'GPT' },
    { id: 'claude', name: 'Claude' },
  ]

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Provider
      </label>
      <div className="flex gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => onProviderChange(provider.id)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              selectedProvider === provider.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            {provider.name}
          </button>
        ))}
      </div>
    </div>
  )
}

