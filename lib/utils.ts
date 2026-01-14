import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitário do shadcn/ui para combinar classes Tailwind
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata uma data para o padrão brasileiro dd/mm/yyyy
 */
export function formatDateBR(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  // Adiciona 1 dia para compensar timezone
  const adjustedDate = new Date(dateObj)
  adjustedDate.setDate(adjustedDate.getDate() + 1)

  const day = adjustedDate.getDate().toString().padStart(2, '0')
  const month = (adjustedDate.getMonth() + 1).toString().padStart(2, '0')
  const year = adjustedDate.getFullYear()

  return `${day}/${month}/${year}`
}

/**
 * Formata uma data para o padrão de input (yyyy-mm-dd)
 */
export function formatDateInput(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  const year = dateObj.getFullYear()
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0')
  const day = dateObj.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * Retorna a data de hoje no formato yyyy-mm-dd (para inputs)
 */
export function getToday(): string {
  return formatDateInput(new Date())
}
