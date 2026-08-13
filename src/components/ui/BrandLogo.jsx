export function BrandLogo({ size = 32 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="resumeGradient" x1="0"y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
      </defs>
      <rect
        x="4"
        y="4"
        width="40"
        height="40"
        rx="10"
        fill="url(#resumeGradient)"
      />
      <path
        d="M16 16h16v3H16zm0 8h10v3H16zm0 8h8v3H16z"
        fill="#f9fafb"
      />
    </svg>
  );
}
