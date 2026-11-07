/**
 * Monograma RF redesenhado a partir da logo (foto). Se a Renata tiver o arquivo
 * vetorial original, troque estes paths por ele.
 */
export function Monograma({ className, titulo = "Renata Ferré" }: { className?: string; titulo?: string }) {
  return (
    <svg className={className} viewBox="0 0 340 640" role="img" aria-label={titulo} fill="none">
      <g stroke="currentColor" strokeWidth="22" strokeLinecap="butt" strokeLinejoin="miter">
        <path d="M45 402V48h105a83.5 83.5 0 0 1 0 167H45" />
        <path d="M140 222l162 186" />
        <path d="M150 246v364" />
        <path d="M160 252h162" />
        <path d="M139 406h163" />
      </g>
    </svg>
  );
}

/** Assinatura horizontal: RF | Jóias */
export function Assinatura({ compacta = false }: { compacta?: boolean }) {
  return (
    <span className="assinatura" data-compacta={compacta || undefined}>
      <Monograma className="assinatura__rf" />
      <span className="assinatura__barra" aria-hidden />
      <span className="assinatura__texto">
        <span className="assinatura__nome">Renata Ferré</span>
        <span className="assinatura__joias">Jóias</span>
      </span>
    </span>
  );
}

/** Búzio: único glifo de marca do site. */
export function Buzio({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size * 1.3} viewBox="0 0 20 26" fill="none" aria-hidden>
      <path
        d="M10 1.5C5 1.5 2 6.5 2 13s3 11.5 8 11.5 8-5 8-11.5S15 1.5 10 1.5Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M10 5.5c-1.2 2.4-1.6 5-1.6 7.5s.4 5.1 1.6 7.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path
        d="M8.4 8.5h-1.6M8.1 11h-1.8M8.1 13.5h-1.8M8.2 16h-1.7M8.6 18.5H7.2M11.4 8.5h1.6M11.9 11h1.8M11.9 13.5h1.8M11.8 16h1.7M11.4 18.5h1.4"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}
