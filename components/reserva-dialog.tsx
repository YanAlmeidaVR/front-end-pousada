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
import { api, type Hospede, type Quarto } from "@/lib/api"
import { handleApiError, showSuccess, type ErrorDialogState } from "@/lib/error-handler"
import { ErrorDialog } from "@/components/error-dialog"
import { DateInput } from "@/components/date-input"

interface ReservaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  hospedes: Hospede[]
  quartos: Quarto[]
}

export function ReservaDialog({ open, onOpenChange, onSuccess, hospedes, quartos }: ReservaDialogProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    hospedeId: "",
    numeroQuarto: "",
    dataCheckIn: "",
    dataCheckOut: "",
    metodoPagamento: "DINHEIRO" as string,
  })
  const [valorTotal, setValorTotal] = useState(0)
  
  // 🎯 Estado do ErrorDialog
  const [errorDialog, setErrorDialog] = useState<ErrorDialogState>({
    open: false,
    title: "",
    description: "",
  })

  // Mostrar TODOS os quartos - a validação de disponibilidade é no backend
  const quartosDisponiveis = quartos

  useEffect(() => {
    // Calcular valor total quando datas ou quarto mudarem
    if (formData.numeroQuarto && formData.dataCheckIn && formData.dataCheckOut) {
      const quarto = quartos.find((q) => q.numeroQuarto === parseInt(formData.numeroQuarto))
      if (quarto) {
        const checkIn = new Date(formData.dataCheckIn)
        const checkOut = new Date(formData.dataCheckOut)
        const diferencaDias = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diferencaDias > 0) {
          setValorTotal(quarto.precoPorNoite * diferencaDias)
        } else {
          setValorTotal(0)
        }
      }
    } else {
      setValorTotal(0)
    }
  }, [formData.numeroQuarto, formData.dataCheckIn, formData.dataCheckOut, quartos])

  useEffect(() => {
    // Resetar form quando fechar
    if (!open) {
      setFormData({
        hospedeId: "",
        numeroQuarto: "",
        dataCheckIn: "",
        dataCheckOut: "",
        metodoPagamento: "DINHEIRO",
      })
      setValorTotal(0)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await api.createReserva({
        hospedeId: parseInt(formData.hospedeId),
        numeroQuarto: parseInt(formData.numeroQuarto),
        dataCheckIn: formData.dataCheckIn,
        dataCheckOut: formData.dataCheckOut,
        metodoPagamento: formData.metodoPagamento,
      })
      
      showSuccess("Reserva criada com sucesso!")
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      // 🎯 Usar o handleApiError com o ErrorDialog
      handleApiError(error, setErrorDialog)
    } finally {
      setLoading(false)
    }
  }

  // Data mínima é hoje
  const hoje = new Date().toISOString().split("T")[0]

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Nova Reserva</DialogTitle>
              <DialogDescription>Preencha os dados para criar uma nova reserva.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="hospede">Hóspede</Label>
                <Select
                  value={formData.hospedeId}
                  onValueChange={(value) => setFormData({ ...formData, hospedeId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um hóspede" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospedes.map((hospede) => (
                      <SelectItem key={hospede.id} value={hospede.id.toString()}>
                        {hospede.nomeHospede} - {hospede.cpf}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="quarto">Quarto</Label>
                <Select
                  value={formData.numeroQuarto}
                  onValueChange={(value) => setFormData({ ...formData, numeroQuarto: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um quarto" />
                  </SelectTrigger>
                  <SelectContent>
                    {quartosDisponiveis.length === 0 ? (
                      <SelectItem value="none" disabled>
                        Nenhum quarto cadastrado
                      </SelectItem>
                    ) : (
                      quartosDisponiveis.map((quarto) => (
                        <SelectItem key={quarto.id} value={quarto.numeroQuarto.toString()}>
                          Quarto {quarto.numeroQuarto} - {quarto.tipoQuarto} - R${" "}
                          {quarto.precoPorNoite.toFixed(2)}/noite
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="checkIn">Data Check-in</Label>
                  <DateInput
                    id="checkIn"
                    value={formData.dataCheckIn}
                    onChange={(value) => setFormData({ ...formData, dataCheckIn: value })}
                    min={hoje}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="checkOut">Data Check-out</Label>
                  <DateInput
                    id="checkOut"
                    value={formData.dataCheckOut}
                    onChange={(value) => setFormData({ ...formData, dataCheckOut: value })}
                    min={formData.dataCheckIn || hoje}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="metodoPagamento">Método de Pagamento</Label>
                <Select
                  value={formData.metodoPagamento}
                  onValueChange={(value) => setFormData({ ...formData, metodoPagamento: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DINHEIRO">Dinheiro</SelectItem>
                    <SelectItem value="PIX">PIX</SelectItem>
                    <SelectItem value="CARTAO_CREDITO">Cartão de Crédito</SelectItem>
                    <SelectItem value="CARTAO_DEBITO">Cartão de Débito</SelectItem>
                    <SelectItem value="TRANSFERENCIA_BANCARIA">Transferência Bancária</SelectItem>
                    <SelectItem value="BOLETO">Boleto</SelectItem>
                    <SelectItem value="CHEQUE">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {valorTotal > 0 && (
                <div className="rounded-lg border bg-muted p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Valor Total:</span>
                    <span className="text-2xl font-bold text-primary">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(valorTotal)}
                    </span>
                  </div>
                  {formData.dataCheckIn && formData.dataCheckOut && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {Math.ceil(
                        (new Date(formData.dataCheckOut).getTime() - new Date(formData.dataCheckIn).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      diária(s)
                    </p>
                  )}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || quartosDisponiveis.length === 0}>
                {loading ? "Criando..." : "Criar Reserva"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 🎯 ErrorDialog - Modal de erro customizado */}
      <ErrorDialog
        open={errorDialog.open}
        onOpenChange={(open) => setErrorDialog({ ...errorDialog, open })}
        title={errorDialog.title}
        description={errorDialog.description}
      />
    </>
  )
}