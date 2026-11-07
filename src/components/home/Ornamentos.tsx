/** Ornamentos geométricos em ouro (losangos, traços, arcos), no espírito do material da coleção. */

type P = { className?: string };

/** Traço — losango — traço */
export function Ornamento({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 240 14" fill="none" aria-hidden>
      <g stroke="currentColor" strokeWidth="1">
        <path d="M0 7h100M140 7h100" />
        <path d="M120 1.5l5.5 5.5-5.5 5.5-5.5-5.5z" />
        <path d="M120 4.5l2.5 2.5-2.5 2.5-2.5-2.5z" fill="currentColor" />
      </g>
      <circle cx="106" cy="7" r="1.4" fill="currentColor" />
      <circle cx="134" cy="7" r="1.4" fill="currentColor" />
    </svg>
  );
}

/** Losango vertical com pontos */
export function Losango({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 20 52" fill="none" aria-hidden>
      <circle cx="10" cy="2" r="1.6" fill="currentColor" />
      <path d="M10 11l8 15-8 15-8-15z" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 21l2.6 5-2.6 5-2.6-5z" fill="currentColor" />
      <circle cx="10" cy="50" r="1.6" fill="currentColor" />
    </svg>
  );
}

/** Coluna vertical de chevrons e losangos */
export function Totem({ className }: P) {
  return (
    <svg className={className} viewBox="0 0 40 300" fill="none" aria-hidden>
      <g stroke="currentColor" strokeWidth="1.3" strokeLinejoin="miter">
        <path d="M8 8l12 10 12-10" />
        <path d="M8 18l12 10 12-10" />
        <circle cx="4" cy="38" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="36" cy="38" r="1.6" fill="currentColor" stroke="none" />
        <path d="M20 26l12 12-12 12-12-12z" />
        <path d="M20 33l5 5-5 5-5-5z" fill="currentColor" />
        <path d="M8 58l12 10 12-10" />
        <path d="M20 84v26M14 90v14M26 90v14" />
        <path d="M20 128l12 12-12 12-12-12z" />
        <path d="M20 135l5 5-5 5-5-5z" fill="currentColor" />
        <path d="M8 162l12-10 12 10" />
        <path d="M8 172l12-10 12 10" />
        <path d="M20 192v40" />
        <circle cx="20" cy="248" r="3" />
        <path d="M8 268l12 10 12-10" />
        <path d="M20 284l6 6-6 6-6-6z" fill="currentColor" />
      </g>
    </svg>
  );
}
