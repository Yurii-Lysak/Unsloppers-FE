import { Columns3 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { FieldSpec } from '@/types/employees'

interface ColumnPickerProps {
  fields: FieldSpec[]
  selectedColumnIds: string[]
  onChange: (columnIds: string[]) => void
}

export const ColumnPicker = ({ fields, selectedColumnIds, onChange }: ColumnPickerProps) => {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const toggleColumn = (fieldId: string) => {
    if (selectedColumnIds.includes(fieldId)) {
      if (selectedColumnIds.length === 1) {
        return
      }
      onChange(selectedColumnIds.filter(entry => entry !== fieldId))
      return
    }
    onChange([...selectedColumnIds, fieldId])
  }

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen(current => !current)}
        data-testid="directory-column-picker"
      >
        <Columns3 className="size-4" />
        {t('directory.columns')}
      </Button>

      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-lg border border-border bg-card p-3 shadow-lg">
          <Label>{t('directory.visibleColumns')}</Label>
          <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
            {fields.map(field => (
              <label key={field.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedColumnIds.includes(field.id)}
                  onChange={() => toggleColumn(field.id)}
                />
                <span>{field.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
