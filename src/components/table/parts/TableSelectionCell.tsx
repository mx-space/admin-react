import { Checkbox } from '~/components/ui/Checkbox'
import { color } from '~/styles/tokens'

export interface TableSelectionCellProps {
  kind: 'header' | 'row' | 'radio'
  checked: boolean
  indeterminate?: boolean
  disabled?: boolean
  onChange: (next: boolean) => void
}

export const TableSelectionCell = ({
  kind,
  checked,
  indeterminate,
  disabled,
  onChange,
}: TableSelectionCellProps) => {
  if (kind === 'radio') {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={checked}
        aria-label={checked ? 'Unselect row' : 'Select row'}
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation()
          if (!disabled) onChange(!checked)
        }}
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          border: `1.5px solid ${
            checked ? color.primary : color.hairlineStrong
          }`,
          background: checked ? color.primary : 'transparent',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.5 : 1,
          padding: 0,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {checked ? (
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: color.onPrimary,
            }}
          />
        ) : null}
      </button>
    )
  }
  return (
    <Checkbox
      size="sm"
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      onClick={(e: React.MouseEvent) => e.stopPropagation()}
      onCheckedChange={(v) => onChange(v === true)}
      aria-label={
        kind === 'header'
          ? 'Select all rows'
          : checked
            ? 'Unselect row'
            : 'Select row'
      }
    />
  )
}
