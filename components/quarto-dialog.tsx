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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { api, type Quarto } from "@/lib/api"

interface QuartoDialogProps {
  quarto?: Quarto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function QuartoDialog({ quarto, open, onOpenChange, onSuccess }: QuartoDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    numeroQuarto: "",
    tipoQuarto: "SINGLE" as "SINGLE" | "DOUBLE" | "SUITE" | "DELUXE",
    precoPorNoite: "",
    quartoStatus: "DISPONIVEL" as "DISPONIVEL" | "OCUPADO" | "MANUTENCAO" | "LIMPEZA",
  })

  useEffect(() => {
    if (quarto) {
      setFormData({
        numeroQuarto: quarto.numeroQuarto.toString(),
        tipoQuarto: quarto.tipoQuarto,
        precoPorNoite: quarto.precoPorNoite.toString(),
        quartoStatus: quarto.quartoStatus,
      })
    } else {
      setFormData({
        numeroQuarto: "",
        tipoQuarto: "SINGLE",
        precoPorNoite: "",
        quartoStatus: "DISPONIVEL",
      })
    }
  }, [quarto, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = {
        numeroQuarto: parseInt(formData.numeroQuarto),
        tipoQuarto: formData.tipoQuarto,
        precoPorNoite: parseFloat(formData.precoPorNoite),
        quartoStatus: formData.quartoStatus,
      }

      if (quarto) {
        // Atualizar status se mudou
        if (data.quartoStatus !== quarto.quartoStatus) {
          await api.updateQuartoStatus(data.numeroQuarto, data.quartoStatus)
        }
      } else {
        await api.createQuarto(data)
      }
      
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao salvar quarto:", error)
      alert("Erro ao salvar quarto. Verifique os dados e tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{quarto ? "Editar Quarto" : "Novo Quarto"}</DialogTitle>
            <DialogDescription>
              {quarto
                ? "Atualize as informações do quarto."
                : "Preencha os dados para cadastrar um novo quarto."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="numero">Número do Quarto</Label>
              <Input
                id="numero"
                type="number"
                value={formData.numeroQuarto}
                onChange={(e) => setFormData({ ...formData, numeroQuarto: e.target.value })}
                placeholder="101"
                required
                disabled={!!quarto}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipo">Tipo do Quarto</Label>
              <Select
                value={formData.tipoQuarto}
                onValueChange={(value: any) => setFormData({ ...formData, tipoQuarto: value })}
                disabled={!!quarto}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SINGLE">Single (Solteiro)</SelectItem>
                  <SelectItem value="DOUBLE">Double (Casal)</SelectItem>
                  <SelectItem value="SUITE">Suíte (Tripla)</SelectItem>
                  <SelectItem value="DELUXE">Deluxe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preco">Preço por Noite (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formData.precoPorNoite}
                onChange={(e) => setFormData({ ...formData, precoPorNoite: e.target.value })}
                placeholder="150.00"
                required
                disabled={!!quarto}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.quartoStatus}
                onValueChange={(value: any) => setFormData({ ...formData, quartoStatus: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DISPONIVEL">Disponível</SelectItem>
                  <SelectItem value="OCUPADO">Ocupado</SelectItem>
                  <SelectItem value="MANUTENCAO">Manutenção</SelectItem>
                  <SelectItem value="LIMPEZA">Limpeza</SelectItem>
                </SelectContent>
              </Select>
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