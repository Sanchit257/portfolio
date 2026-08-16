export function ImagePlaceholder({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center bg-black/70 border border-dashed border-[var(--color-outline)] text-center font-mono text-sm uppercase tracking-widest text-[var(--color-on-surface-variant)] ${className}`}
    >
      [{label}]
    </div>
  );
}
