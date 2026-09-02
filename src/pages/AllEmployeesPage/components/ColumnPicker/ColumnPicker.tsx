import { Columns3 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/Button/Button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/Popover/Popover'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Label } from '@/components/Label/Label'
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" data-testid="directory-column-picker">
          <Columns3 className="size-4" />
          {t('directory.columns')}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start">
        <Label>{t('directory.visibleColumns')}</Label>
        <div className="mt-2 max-h-64 space-y-2 overflow-y-auto">
          {fields.map(field => (
            <Checkbox
              key={field.id}
              checked={selectedColumnIds.includes(field.id)}
              label={field.name}
              onCheckedChange={() => toggleColumn(field.id)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
