'use client'

import type { Provider } from '@/lib/storage'
import type { Model } from '@/lib/models'
import { getModelsByProvider } from '@/lib/models'

interface ModelSelectorProps {
  provider: Provider
  selectedModel: string | null
  onModelChange: (modelId: string) => void
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  provider,
  selectedModel,
  onModelChange,
}) => {
  const models = getModelsByProvider(provider)

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white dark:text-black">
        Model
      </label>
      <select
        value={selectedModel || ''}
        onChange={(e) => onModelChange(e.target.value)}
        className="w-full px-3 py-2 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-black/30 focus:border-white/30 dark:focus:border-black/30 text-white dark:text-black appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value="" className="bg-black text-white dark:bg-white dark:text-black">Select a model</option>
        {models.map((model) => (
          <option key={model.id} value={model.id} className="bg-black text-white dark:bg-white dark:text-black">
            {model.name}
          </option>
        ))}
      </select>
    </div>
  )
}

