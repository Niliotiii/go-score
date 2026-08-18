export function Logo({ className = '', size = 36, colored = true, showWordmark = true }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="text-goscore-fg shrink-0"
      >
        <path d="M5 3h22l-2 22-9 4-9-4-2-22z" fill="currentColor" />
        <path
          d="M11.5 23l4.5-14"
          stroke={colored ? '#40b85c' : 'currentColor'}
          strokeWidth="3"
          strokeLinecap="square"
        />
        <path
          d="M16.5 23l4.5-14"
          stroke={colored ? '#40b85c' : 'currentColor'}
          strokeWidth="3"
          strokeLinecap="square"
        />
      </svg>
      {showWordmark && (
        <h1 className="font-display text-[34px] font-bold tracking-logo leading-none text-goscore-fg">
          Go<span className="text-goscore-accent">Score</span>
        </h1>
      )}
    </div>
  )
}
