type NumberFieldProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  hint?: string;
};

export function NumberField({
  label,
  value,
  onChange,
  step = 1,
  min,
  hint,
}: NumberFieldProps) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium text-[var(--muted)]">{label}</span>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={min}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
      {hint ? (
        <span className="text-[10px] text-[var(--muted)]">{hint}</span>
      ) : null}
    </label>
  );
}
