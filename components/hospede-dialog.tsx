"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { api, type Hospede } from "@/lib/api"

interface HospedeDialogProps {
  hospede?: Hospede | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function HospedeDialog({ hospede, open, onOpenChange, onSuccess }: HospedeDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nomeHospede: "",
    cpf: "",
    telefone: "",
  })

  useEffect(() => {
    if (hospede) {
      setFormData({
        nomeHospede: hospede.nomeHospede,
        cpf: hospede.cpf,
        telefone: hospede.telefone,
      })
    } else {
      setFormData({
        nomeHospede: "",
        cpf: "",
        telefone: "",
      })
    }
  }, [hospede, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (hospede) {
        await api.updateHospede(hospede.id, formData)
      } else {
        await api.createHospede(formData)
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar hóspede:", error)
      alert("Erro ao salvar hóspede. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
    }
    return value
  }

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2")
    }
    return value
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{hospede ? "Editar Hóspede" : "Novo Hóspede"}</DialogTitle>
            <DialogDescription>
              {hospede
                ? "Atualize as informações do hóspede."
                : "Preencha os dados para cadastrar um novo hóspede."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome">Nome completo</Label>
              <Input
                id="nome"
                value={formData.nomeHospede}
                onChange={(e) => setFormData({ ...formData, nomeHospede: e.target.value })}
                placeholder="João da Silva"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => setFormData({ ...formData, cpf: formatCPF(e.target.value) })}
                placeholder="123.456.789-00"
                maxLength={14}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={(e) => setFormData({ ...formData, telefone: formatPhone(e.target.value) })}
                placeholder="(11) 98765-4321"
                maxLength={15}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}