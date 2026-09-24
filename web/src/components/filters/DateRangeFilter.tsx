import { DATE_RANGE_OPTIONS, type DateRangePreset } from '../../lib/dateRange'

type DateRangeFilterProps = {
  value: DateRangePreset
  onChange: (value: DateRangePreset) => void
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Date range">
      {DATE_RANGE_OPTIONS.map((option) => {
        const selected = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={
              selected
                ? 'rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white'
                : 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50'
            }
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
