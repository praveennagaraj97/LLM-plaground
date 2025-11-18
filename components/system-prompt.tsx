'use client'

interface SystemPromptProps {
  value: string
  onChange: (value: string) => void
}

export const SystemPrompt: React.FC<SystemPromptProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-white dark:text-black">
        System Prompt
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter system prompt (optional)"
        rows={4}
        className="w-full px-3 py-2 backdrop-blur-md bg-white/10 dark:bg-black/10 border border-white/20 dark:border-black/20 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-white/30 dark:focus:ring-black/30 focus:border-white/30 dark:focus:border-black/30 resize-none text-white dark:text-black placeholder:text-white/50 dark:placeholder:text-black/50"
      />
    </div>
  )
}

