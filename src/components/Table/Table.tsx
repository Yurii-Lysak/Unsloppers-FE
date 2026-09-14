import type { ComponentProps } from 'react'
import {
  Table as UiTable,
  TableHeader as UiTableHeader,
  TableBody as UiTableBody,
  TableRow as UiTableRow,
  TableHead as UiTableHead,
  TableCell as UiTableCell,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  tableRootClassName,
  tableHeaderClassName,
  tableBodyClassName,
  tableRowClassName,
  tableHeadClassName,
  tableCellClassName,
} from './Table.styles'

export const Table = ({
  className,
  ...props
}: ComponentProps<typeof UiTable>) => (
  <UiTable className={cn(tableRootClassName, className)} {...props} />
)

export const TableHeader = ({
  className,
  ...props
}: ComponentProps<typeof UiTableHeader>) => (
  <UiTableHeader className={cn(tableHeaderClassName, className)} {...props} />
)

export const TableBody = ({
  className,
  ...props
}: ComponentProps<typeof UiTableBody>) => (
  <UiTableBody className={cn(tableBodyClassName, className)} {...props} />
)

export const TableRow = ({
  className,
  ...props
}: ComponentProps<typeof UiTableRow>) => (
  <UiTableRow className={cn(tableRowClassName, className)} {...props} />
)

export const TableHead = ({
  className,
  ...props
}: ComponentProps<typeof UiTableHead>) => (
  <UiTableHead className={cn(tableHeadClassName, className)} {...props} />
)

export const TableCell = ({
  className,
  ...props
}: ComponentProps<typeof UiTableCell>) => (
  <UiTableCell className={cn(tableCellClassName, className)} {...props} />
)
