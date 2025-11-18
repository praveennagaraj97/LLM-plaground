'use client'

interface TokenUsageProps {
  inputTokens: number
  outputTokens: number
  totalTokens: number
}

export const TokenUsage: React.FC<TokenUsageProps> = ({
  inputTokens,
  outputTokens,
  totalTokens,
}) => {
  return (
    <div className="backdrop-blur-xl bg-white/5 dark:bg-black/5 rounded-xl border border-white/10 dark:border-black/10 p-3 sm:p-4">
      <h3 className="text-sm font-semibold text-white dark:text-black mb-3">
        Token Usage
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="text-center">
          <div className="text-xs sm:text-sm text-white/60 dark:text-black/60 mb-1">
            Input
          </div>
          <div className="text-sm sm:text-base font-medium text-white dark:text-black">
            {inputTokens.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs sm:text-sm text-white/60 dark:text-black/60 mb-1">
            Output
          </div>
          <div className="text-sm sm:text-base font-medium text-white dark:text-black">
            {outputTokens.toLocaleString()}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs sm:text-sm text-white/60 dark:text-black/60 mb-1">
            Total
          </div>
          <div className="text-sm sm:text-base font-medium text-white dark:text-black">
            {totalTokens.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  )
}

