"use client"

import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import { useState, useEffect, useRef } from "react"

interface DateInputProps {
  value: string // yyyy-mm-dd
  onChange: (value: string) => void // yyyy-mm-dd
  min?: string // yyyy-mm-dd
  required?: boolean
  id?: string
}

export function DateInput({ value, onChange, min, required, id }: DateInputProps) {
  const [displayValue, setDisplayValue] = useState("")
  const [showNativePicker, setShowNativePicker] = useState(false)
  const nativeInputRef = useRef<HTMLInputElement>(null)

  // Converter yyyy-mm-dd para dd/mm/yyyy
  const formatToDisplay = (isoDate: string) => {
    if (!isoDate) return ""
    const [year, month, day] = isoDate.split("-")
    return `${day}/${month}/${year}`
  }

  // Converter dd/mm/yyyy para yyyy-mm-dd
  const formatToISO = (brDate: string) => {
    const cleaned = brDate.replace(/\D/g, "")
    if (cleaned.length !== 8) return ""
    
    const day = cleaned.substring(0, 2)
    const month = cleaned.substring(2, 4)
    const year = cleaned.substring(4, 8)
    
    return `${year}-${month}-${day}`
  }

  // Atualizar display quando value mudar
  useEffect(() => {
    if (value) {
      setDisplayValue(formatToDisplay(value))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/\D/g, "") // Remove não-dígitos
    
    // Limitar a 8 dígitos
    if (input.length > 8) {
      input = input.substring(0, 8)
    }
    
    // Formatar com barras
    let formatted = input
    if (input.length >= 2) {
      formatted = input.substring(0, 2) + "/" + input.substring(2)
    }
    if (input.length >= 4) {
      formatted = input.substring(0, 2) + "/" + input.substring(2, 4) + "/" + input.substring(4)
    }
    
    setDisplayValue(formatted)
    
    // Se completou 8 dígitos, converter para ISO e enviar
    if (input.length === 8) {
      const isoDate = formatToISO(formatted)
      onChange(isoDate)
    } else if (input.length === 0) {
      onChange("")
    }
  }

  const handleBlur = () => {
    // Validar data ao sair do campo
    if (displayValue.length === 10) {
      const isoDate = formatToISO(displayValue)
      onChange(isoDate)
    }
  }

  const handleCalendarClick = () => {
    nativeInputRef.current?.showPicker?.()
  }

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoDate = e.target.value
    onChange(isoDate)
    setDisplayValue(formatToDisplay(isoDate))
  }

  return (
    <div className="relative">
      <Input
        id={id}
        type="text"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="dd/mm/yyyy"
        maxLength={10}
        required={required}
        className="pr-10"
      />
      
      {/* Input nativo escondido para o picker */}
      <input
        ref={nativeInputRef}
        type="date"
        value={value}
        onChange={handleNativeChange}
        min={min}
        className="absolute inset-0 opacity-0 cursor-pointer pointer-events-none"
        tabIndex={-1}
      />
      
      <Calendar 
        className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer hover:text-foreground transition-colors" 
        onClick={handleCalendarClick}
      />
    </div>
  )
}