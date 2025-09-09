import React from 'react'

interface TableProps {
  children: React.ReactNode
  className?: string
}

interface TableHeaderProps {
  children: React.ReactNode
  className?: string
}

interface TableBodyProps {
  children: React.ReactNode
  className?: string
}

interface TableRowProps {
  children: React.ReactNode
  className?: string
}

interface TableCellProps {
  children: React.ReactNode
  className?: string
  header?: boolean
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className={`min-w-full divide-y divide-gray-300 ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`bg-white divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className = '' }: TableRowProps) {
  return (
    <tr className={className}>
      {children}
    </tr>
  )
}

export function TableCell({ children, className = '', header = false }: TableCellProps) {
  const baseClasses = header 
    ? 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
    : 'px-6 py-4 whitespace-nowrap text-sm text-gray-900'
  
  return (
    <td className={`${baseClasses} ${className}`}>
      {children}
    </td>
  )
}
