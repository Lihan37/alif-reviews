import type { ReactNode } from "react";

export function BilingualText({ en, bn, compact = false, className = "" }: { en: ReactNode; bn: ReactNode; compact?: boolean; className?: string }) {
  if (compact) {
    return <span className={className}><span lang="en">{en}</span><span aria-hidden="true"> · </span><span lang="bn">{bn}</span></span>;
  }

  return <span className={`inline-flex flex-col ${className}`}>
    <span lang="en">{en}</span>
    <span lang="bn" className="mt-1 text-[0.82em] leading-[1.35] font-normal opacity-75">{bn}</span>
  </span>;
}
