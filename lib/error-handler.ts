import { toast } from "sonner"

// Tipo para o estado do erro dialog
export interface ErrorDialogState {
  open: boolean
  title: string
  description: string
}

// Mapeamento das exceções do backend para mensagens amigáveis
const errorMessages: Record<string, { title: string; description: string }> = {
  // Hóspede
  CpfJaCadastradoException: {
    title: "CPF já cadastrado",
    description: "Este CPF já está registrado no sistema.",
  },
  HospedeNotFoundException: {
    title: "Hóspede não encontrado",
    description: "O hóspede solicitado não foi encontrado.",
  },

  // Quarto
  NumeroQuartoJaCadastradoException: {
    title: "Número de quarto já existe",
    description: "Já existe um quarto com este número.",
  },
  QuartoNotFoundException: {
    title: "Quarto não encontrado",
    description: "O quarto solicitado não foi encontrado.",
  },
  QuartoOcupadoException: {
    title: "Quarto ocupado",
    description: "Este quarto já possui reserva ativa para o período selecionado.",
  },

  // Reserva
  CheckInInvalidoException: {
    title: "Check-in inválido",
    description: "Ainda não é possível fazer check-in para esta reserva.",
  },
  PagamentoInvalidoException: {
    title: "Pagamento pendente",
    description: "O pagamento desta reserva ainda não foi processado.",
  },
  ReservaJaCanceladaException: {
    title: "Reserva cancelada",
    description: "Esta reserva já foi cancelada anteriormente.",
  },
  ReservaNotFoundExceptionById: {
    title: "Reserva não encontrada",
    description: "A reserva solicitada não foi encontrada.",
  },
  ReservaNotFoundExceptionByNumber: {
    title: "Reserva não encontrada",
    description: "Não foi encontrada reserva para o número informado.",
  },
  BusinessException: {
    title: "Erro de validação",
    description: "Não foi possível completar a operação.",
  },
}

export function handleApiError(
  error: any,
  setErrorDialog?: (state: ErrorDialogState) => void
) {
  console.error("API Error:", error)

  // Tentar extrair mensagem do backend
  let errorInfo = {
    title: "Erro",
    description: "Ocorreu um erro inesperado.",
  }

  // Se o erro tem uma resposta do backend
  if (error.message) {
    let errorMessage = error.message

    // Tentar parsear se for JSON
    try {
      const jsonMatch = errorMessage.match(/\{.*\}/)
      if (jsonMatch) {
        const errorData = JSON.parse(jsonMatch[0])
        errorMessage = errorData.message || errorMessage
      }
    } catch (e) {
      // Se não for JSON válido, continua com a mensagem original
    }

    // Procurar por nome de exceção na mensagem
    const foundError = Object.keys(errorMessages).find((key) => 
      errorMessage.includes(key)
    )

    if (foundError) {
      errorInfo = errorMessages[foundError]
    } 
    // Verificar se a mensagem contém "Quarto" e "ocupado"
    else if (errorMessage.includes("Quarto") && errorMessage.includes("ocupado")) {
      errorInfo = {
        title: "Quarto ocupado",
        description: errorMessage,
      }
    }
    // Verificar se a mensagem contém "Verifique se as datas"
    else if (errorMessage.includes("Verifique se as datas")) {
      errorInfo = {
        title: "Datas inválidas",
        description: errorMessage,
      }
    }
    else if (errorMessage.includes("Failed to fetch")) {
      errorInfo = {
        title: "Erro de conexão",
        description: "Não foi possível conectar ao servidor. Verifique sua conexão.",
      }
    } else if (errorMessage.includes("Falha ao")) {
      errorInfo = {
        title: "Erro na operação",
        description: errorMessage.replace("Falha ao criar reserva. ", ""),
      }
    } else {
      // Usar a mensagem do backend diretamente se não encontrou padrão
      errorInfo.description = errorMessage
    }
  }

  // Se foi passada uma função para abrir o dialog, usa ela
  if (setErrorDialog) {
    setErrorDialog({
      open: true,
      ...errorInfo,
    })
  } else {
    // Fallback para toast se não houver dialog
    toast.error(errorInfo.title, {
      description: errorInfo.description,
      duration: 4000,
    })
  }
}

// Função helper para mostrar sucesso
export function showSuccess(title: string, description?: string) {
  toast.success(title, {
    description,
    duration: 3000,
  })
}

// Função helper para mostrar info
export function showInfo(title: string, description?: string) {
  toast.info(title, {
    description,
    duration: 3000,
  })
}

// Função helper para mostrar aviso
export function showWarning(title: string, description?: string) {
  toast.warning(title, {
    description,
    duration: 3000,
  })
}