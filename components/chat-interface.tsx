'use client'

import { useState, useRef, useEffect } from 'react'

export interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/60 dark:text-black/60 mt-8">
            Start a conversation by sending a message
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 backdrop-blur-xl shadow-lg ${
                  message.role === 'user'
                    ? 'bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 text-white dark:text-black'
                    : 'bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 text-white dark:text-black'
                }`}
              >
                <div className="text-xs sm:text-sm font-medium mb-1.5 opacity-80">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="backdrop-blur-xl bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-2xl px-4 py-3 shadow-lg">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-white/60 dark:bg-black/60 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-white/60 dark:bg-black/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-white/60 dark:bg-black/60 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="border-t border-white/10 dark:border-black/10 p-4 sm:p-6 backdrop-blur-sm bg-white/5 dark:bg-black/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 sm:py-3 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-black/30 focus:border-white/30 dark:focus:border-black/30 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black placeholder:text-white/50 dark:placeholder:text-black/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-md bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 text-white dark:text-black rounded-xl font-medium transition-all duration-200 border border-white/20 dark:border-black/20 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}

