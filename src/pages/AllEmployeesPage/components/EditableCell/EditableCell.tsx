import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@/components/Checkbox/Checkbox'
import { Select } from '@/components/Select/Select'
import { Input as UiInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { FieldSpec, FieldValue } from '@/types/employees'

interface EditableCellProps {
  field: FieldSpec
  value: FieldValue
  writable: boolean
  displayValue: string
  onSave: (value: FieldValue) => Promise<void>
  isSavingExternal?: boolean
}

const valueToDraft = (value: FieldValue): string => {
  if (value === null || value === undefined) {
    return ''
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return String(value)
}

export const EditableCell = ({
  field,
  value,
  writable,
  displayValue,
  onSave,
  isSavingExternal = false,
}: EditableCellProps) => {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(valueToDraft(value))
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array.isArray(value) ? value : typeof value === 'string' ? [value] : [],
  )
  const [savedFlash, setSavedFlash] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const isBusy = isSaving || isSavingExternal

  const cancelEdit = useCallback(() => {
    setDraft(valueToDraft(value))
    setSelectedOptions(
      Array.isArray(value) ? value : typeof value === 'string' ? [value] : [],
    )
    setIsEditing(false)
  }, [value])

  const parseDraftValue = (): FieldValue => {
    if (field.type === 'boolean') {
      return draft === 'true'
    }
    if (field.type === 'number') {
      const parsed = Number(draft)
      return Number.isNaN(parsed) ? null : parsed
    }
    if (field.type === 'multi_select') {
      return selectedOptions
    }
    if (field.type === 'select') {
      return draft.length > 0 ? draft : null
    }
    if (field.type === 'date') {
      return draft.length > 0 ? draft : null
    }
    return draft.length > 0 ? draft : null
  }

  const commitWithValue = useCallback(
    async (nextValue: FieldValue) => {
      if (isBusy) {
        return
      }
      setIsSaving(true)
      try {
        await onSave(nextValue)
        setIsEditing(false)
        setSavedFlash(true)
        window.setTimeout(() => setSavedFlash(false), 700)
      } catch {
        // Parent mutation handles success/error toasts; keep editable state.
      } finally {
        setIsSaving(false)
      }
    },
    [isBusy, onSave],
  )

  const commitEdit = useCallback(async () => {
    await commitWithValue(parseDraftValue())
  }, [commitWithValue, draft, field.type, selectedOptions])

  const startEdit = () => {
    if (!writable || isBusy) {
      return
    }
    setDraft(valueToDraft(value))
    setSelectedOptions(
      Array.isArray(value) ? value : typeof value === 'string' ? [value] : [],
    )
    setIsEditing(true)
    window.setTimeout(() => inputRef.current?.focus(), 0)
  }

  if (!writable || !field.editable) {
    return <span>{displayValue}</span>
  }

  if (!isEditing) {
    return (
      <button
        type="button"
        className={cn(
          'w-full rounded px-1 py-0.5 text-left hover:bg-muted/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          savedFlash && 'ring-2 ring-ring ring-offset-1',
        )}
        onClick={startEdit}
        disabled={isBusy}
        data-testid={`directory-cell-${field.id}`}
      >
        {displayValue}
      </button>
    )
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      cancelEdit()
    }
    if (event.key === 'Enter') {
      event.preventDefault()
      void commitEdit()
    }
  }

  if (field.type === 'boolean') {
    return (
      <Select
        value={draft}
        disabled={isBusy}
        onValueChange={nextValue => {
          setDraft(nextValue)
          void commitWithValue(nextValue === 'true')
        }}
        options={[
          { value: 'true', label: t('directory.boolean.true') },
          { value: 'false', label: t('directory.boolean.false') },
        ]}
        data-testid={`directory-cell-editor-${field.id}`}
      />
    )
  }

  if (field.type === 'select' && (field.options?.length ?? 0) > 0) {
    return (
      <Select
        value={draft}
        disabled={isBusy}
        onValueChange={nextValue => {
          setDraft(nextValue)
          void commitWithValue(nextValue.length > 0 ? nextValue : null)
        }}
        options={[
          { value: '', label: t('directory.selectOption') },
          ...(field.options ?? []).map(option => ({ value: option, label: option })),
        ]}
        data-testid={`directory-cell-editor-${field.id}`}
      />
    )
  }

  if (field.type === 'multi_select' && (field.options?.length ?? 0) > 0) {
    return (
      <div className="space-y-1" data-testid={`directory-cell-editor-${field.id}`}>
        {(field.options ?? []).map(option => (
          <label key={option} className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={selectedOptions.includes(option)}
              disabled={isBusy}
              onCheckedChange={checked => {
                setSelectedOptions(current =>
                  checked
                    ? [...current, option]
                    : current.filter(entry => entry !== option),
                )
              }}
            />
            <span>{option}</span>
          </label>
        ))}
        <button
          type="button"
          className="text-xs text-primary underline disabled:opacity-50"
          disabled={isBusy}
          onClick={() => void commitEdit()}
        >
          {t('directory.inlineEdit.save')}
        </button>
      </div>
    )
  }

  return (
    <UiInput
      ref={inputRef}
      value={draft}
      onChange={event => setDraft(event.target.value)}
      onBlur={() => void commitEdit()}
      onKeyDown={handleKeyDown}
      type={field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
      disabled={isBusy}
      className="h-8"
      data-testid={`directory-cell-editor-${field.id}`}
    />
  )
}
