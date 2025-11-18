'use client'

import { useState, useEffect } from 'react'
import type { Provider } from '@/lib/storage'
import { getApiKey, getSelectedKeyId } from '@/lib/storage'
import { ApiKeyManager } from './api-key-manager'
import { ModelSelector } from './model-selector'
import { SystemPrompt } from './system-prompt'
import { ChatInterface, type Message } from './chat-interface'
import { TokenUsage } from './token-usage'

interface TokenUsageData {
  promptTokenCount: number
  candidatesTokenCount: number
  totalTokenCount: number
}

export const Playground: React.FC = () => {
  const [provider] = useState<Provider>('gemini')
  const [selectedModel, setSelectedModel] = useState<string | null>(
    'gemini-2.5-flash'
  )
  const [systemPrompt, setSystemPrompt] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [tokenUsage, setTokenUsage] = useState<TokenUsageData>({
    promptTokenCount: 0,
    candidatesTokenCount: 0,
    totalTokenCount: 0,
  })

  useEffect(() => {
    // Check if API key exists for current provider
    const apiKey = getApiKey(provider)
    setHasApiKey(!!apiKey)
  }, [provider])

  const handleSendMessage = async (content: string) => {
    const selectedKeyId = getSelectedKeyId(provider)
    const apiKey = getApiKey(provider, selectedKeyId || undefined)
    if (!apiKey) {
      alert('Please set an API key first')
      return
    }

    if (!selectedModel) {
      alert('Please select a model')
      return
    }

    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider,
          model: selectedModel,
          apiKey,
          messages: newMessages,
          systemPrompt,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to get response')
      }

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.content,
      }
      setMessages([...newMessages, assistantMessage])
      
      // Update token usage if provided
      if (data.usage) {
        setTokenUsage((prev) => ({
          promptTokenCount: prev.promptTokenCount + (data.usage.promptTokenCount || 0),
          candidatesTokenCount: prev.candidatesTokenCount + (data.usage.candidatesTokenCount || 0),
          totalTokenCount: prev.totalTokenCount + (data.usage.totalTokenCount || 0),
        }))
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message}`,
      }
      setMessages([...newMessages, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black dark:bg-white">
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white dark:text-black mb-4 sm:mb-6 md:mb-8 text-center sm:text-left">
          LLM Playground
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <div className="backdrop-blur-xl bg-white/5 dark:bg-black/5 rounded-2xl shadow-2xl border border-white/10 dark:border-black/10 p-4 sm:p-6 space-y-4 sm:space-y-6">
              <ApiKeyManager
                provider={provider}
                onKeyChange={setHasApiKey}
              />

              <ModelSelector
                provider={provider}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />

              <SystemPrompt
                value={systemPrompt}
                onChange={setSystemPrompt}
              />

              <button
                onClick={() => {
                  setMessages([])
                  setTokenUsage({
                    promptTokenCount: 0,
                    candidatesTokenCount: 0,
                    totalTokenCount: 0,
                  })
                }}
                className="w-full px-4 py-2 backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white dark:text-black rounded-xl font-medium transition-all duration-200 border border-white/20 dark:border-black/20 hover:border-white/30 dark:hover:border-black/30 shadow-lg"
              >
                Clear Chat
              </button>

              <TokenUsage
                inputTokens={tokenUsage.promptTokenCount}
                outputTokens={tokenUsage.candidatesTokenCount}
                totalTokens={tokenUsage.totalTokenCount}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-xl bg-white/5 dark:bg-black/5 rounded-2xl shadow-2xl border border-white/10 dark:border-black/10 h-[calc(100vh-8rem)] sm:h-[calc(100vh-10rem)] md:h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
              <div className="p-4 sm:p-6 border-b border-white/10 dark:border-black/10 backdrop-blur-sm bg-white/5 dark:bg-black/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white dark:text-black">
                      Chat
                    </h2>
                    {selectedModel && (
                      <p className="text-xs sm:text-sm text-white/70 dark:text-black/70 mt-1">
                        Using {selectedModel}
                      </p>
                    )}
                  </div>
                  {tokenUsage.totalTokenCount > 0 && (
                    <div className="flex gap-3 sm:gap-4 text-xs sm:text-sm">
                      <div className="text-white/70 dark:text-black/70">
                        <span className="font-medium">Input:</span> {tokenUsage.promptTokenCount.toLocaleString()}
                      </div>
                      <div className="text-white/70 dark:text-black/70">
                        <span className="font-medium">Output:</span> {tokenUsage.candidatesTokenCount.toLocaleString()}
                      </div>
                      <div className="text-white dark:text-black font-medium">
                        <span>Total:</span> {tokenUsage.totalTokenCount.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

