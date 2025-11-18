import type { Provider } from './storage'

export interface Model {
  id: string
  name: string
  provider: Provider
}

export const GEMINI_MODELS: Model[] = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'gemini' },
  { id: 'gemini-2.0-flash-exp', name: 'Gemini 2.0 Flash (Experimental)', provider: 'gemini' },
  { id: 'gemini-1.5-pro-latest', name: 'Gemini 1.5 Pro (Latest)', provider: 'gemini' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'gemini' },
  { id: 'gemini-1.5-flash-latest', name: 'Gemini 1.5 Flash (Latest)', provider: 'gemini' },
  { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', provider: 'gemini' },
  { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini' },
  { id: 'gemini-pro-vision', name: 'Gemini Pro Vision', provider: 'gemini' },
]

export const GPT_MODELS: Model[] = [
  { id: 'gpt-4', name: 'GPT-4', provider: 'gpt' },
  { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'gpt' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'gpt' },
]

export const CLAUDE_MODELS: Model[] = [
  { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'claude' },
  { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'claude' },
  { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'claude' },
]

export const getAllModels = (): Model[] => {
  return [...GEMINI_MODELS, ...GPT_MODELS, ...CLAUDE_MODELS]
}

export const getModelsByProvider = (provider: Provider): Model[] => {
  switch (provider) {
    case 'gemini':
      return GEMINI_MODELS
    case 'gpt':
      return GPT_MODELS
    case 'claude':
      return CLAUDE_MODELS
    default:
      return []
  }
}

