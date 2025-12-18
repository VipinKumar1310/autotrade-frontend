interface TelegramIconProps {
  size?: number;
  className?: string;
  id?: string;
}

export function TelegramIcon({
  size = 14,
  className,
  id = "tg",
}: TelegramIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" className={className}>
      <defs>
        <linearGradient
          id={`${id}-bg`}
          x1="-683.305"
          x2="-693.305"
          y1="534.845"
          y2="511.512"
          gradientTransform="matrix(6 0 0 -6 4255 3247)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#37aee2" />
          <stop offset="1" stopColor="#1e96c8" />
        </linearGradient>
        <linearGradient
          id={`${id}-arrow`}
          x1="128.991"
          x2="153.991"
          y1="118.245"
          y2="78.245"
          gradientTransform="matrix(1 0 0 -1 0 242)"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#eff7fc" />
          <stop offset="1" stopColor="#fff" />
        </linearGradient>
      </defs>
      <path
        d="M240 120c0 66.3-53.7 120-120 120S0 186.3 0 120 53.7 0 120 0s120 53.7 120 120z"
        fill={`url(#${id}-bg)`}
      />
      <path
        d="M98 175c-3.9 0-3.2-1.5-4.6-5.2L82 132.2 152.8 88l8.3 2.2-6.9 18.8L98 175z"
        fill="#c8daea"
      />
      <path
        d="M98 175c3 0 4.3-1.4 6-3 2.6-2.5 36-35 36-35l-20.5-5-19 12-2.5 30v1z"
        fill="#a9c9dd"
      />
      <path
        d="M100 144.4l48.4 35.7c5.5 3 9.5 1.5 10.9-5.1L179 82.2c2-8.1-3.1-11.7-8.4-9.3L55 117.5c-7.9 3.2-7.8 7.6-1.4 9.5l29.7 9.3L152 93c3.2-2 6.2-.9 3.8 1.3L100 144.4z"
        fill={`url(#${id}-arrow)`}
      />
    </svg>
  );
}

