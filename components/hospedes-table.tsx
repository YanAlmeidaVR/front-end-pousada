"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import type { Hospede, Reserva } from "@/lib/api"

interface HospedesTableProps {
  hospedes: Hospede[]
  reservas: Reserva[]
  onEdit: (hospede: Hospede) => void
  onDelete: (hospede: Hospede) => void
}

export function HospedesTable({ hospedes, reservas, onEdit, onDelete }: HospedesTableProps) {
  const [deleteDialog, setDeleteDialog] = useState<Hospede | null>(null)

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3")
  }

  // Verificar se hóspede tem reservas ativas
  const temReservasAtivas = (hospede: Hospede) => {
    return reservas.some((r) => r.nomeHospede === hospede.nomeHospede && r.statusReserva === "ATIVA")
  }

  // Contar total de reservas do hóspede
  const contarReservas = (hospede: Hospede) => {
    return reservas.filter((r) => r.nomeHospede === hospede.nomeHospede).length
  }

  const handleDelete = (hospede: Hospede) => {
    setDeleteDialog(hospede)
  }

  const confirmDelete = () => {
    if (deleteDialog) {
      onDelete(deleteDialog)
      setDeleteDialog(null)
    }
  }

  return (
    <>
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead className="text-center">Reservas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {hospedes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Nenhum hóspede cadastrado
                </TableCell>
              </TableRow>
            ) : (
              hospedes.map((hospede) => {
                const totalReservas = contarReservas(hospede)
                const temAtivas = temReservasAtivas(hospede)
                
                return (
                  <TableRow key={hospede.id}>
                    <TableCell className="font-medium">{hospede.nomeHospede}</TableCell>
                    <TableCell>{formatCPF(hospede.cpf)}</TableCell>
                    <TableCell>{formatPhone(hospede.telefone)}</TableCell>
                    <TableCell className="text-center">
                      <span className={totalReservas > 0 ? "font-medium" : "text-muted-foreground"}>
                        {totalReservas}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => onEdit(hospede)} className="cursor-pointer">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(hospede)}
                          className="text-destructive hover:text-destructive cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o hóspede <strong>{deleteDialog?.nomeHospede}</strong>?
              {deleteDialog && temReservasAtivas(deleteDialog) && (
                <span className="mt-2 block text-red-600 font-semibold">
                  ⚠️ ATENÇÃO: Este hóspede possui {reservas.filter(r => r.nomeHospede === deleteDialog.nomeHospede && r.statusReserva === 'ATIVA').length} reserva(s) ATIVA(S)! 
                  Ao deletar, as reservas ficarão sem hóspede vinculado!
                </span>
              )}
              {deleteDialog && !temReservasAtivas(deleteDialog) && contarReservas(deleteDialog) > 0 && (
                <span className="mt-2 block text-amber-600">
                  ⚠️ Este hóspede possui {contarReservas(deleteDialog)} reserva(s) no histórico. Ao deletar, essas
                  informações de histórico podem ser afetadas.
                </span>
              )}
              <span className="mt-2 block">Esta ação não pode ser desfeita.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteDialog && temReservasAtivas(deleteDialog) ? "Deletar mesmo assim" : "Deletar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}