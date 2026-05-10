import type { TableDensity, TableState } from '~/atoms/table'

import {
  densityToggleButtonRecipe,
  densityToggleStyle,
} from '../DataTable.css'
import type { StateUpdater } from '../hooks/useDataTable'

export interface TableDensityToggleProps {
  state: TableState
  setState: (updater: StateUpdater) => void
  className?: string
}

const options: { value: TableDensity; label: string }[] = [
  { value: 'compact', label: '紧' },
  { value: 'comfortable', label: '中' },
  { value: 'roomy', label: '松' },
]

export const TableDensityToggle = ({
  state,
  setState,
  className,
}: TableDensityToggleProps) => {
  return (
    <span className={`${densityToggleStyle} ${className ?? ''}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={densityToggleButtonRecipe({
            active: state.density === opt.value,
          })}
          onClick={() =>
            setState((prev) => ({ ...prev, density: opt.value }))
          }
          aria-pressed={state.density === opt.value}
        >
          {opt.label}
        </button>
      ))}
    </span>
  )
}
