"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

type UserContextType = {
  users: User[]
  currentUser: { name: string; email: string } | null
  addUser: (name: string, email: string, password: string) => boolean
  authenticateUser: (email: string, password: string) => boolean
  loginUser: (user: { name: string; email: string }) => void
  logoutUser: () => void
  isEmailTaken: (email: string) => boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null)

  // Carregar dados do localStorage quando o componente montar
  useEffect(() => {
    try {
      // Carregar usuários
      const savedUsers = localStorage.getItem("reiner_lojas_users")
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers)
        setUsers(parsedUsers)
      } else {
        // Criar usuário padrão se não existir nenhum
        const defaultUser: User = {
          id: "1",
          name: "João Silva",
          email: "joao@email.com",
          password: "123456",
          createdAt: new Date().toISOString(),
        }
        setUsers([defaultUser])
        localStorage.setItem("reiner_lojas_users", JSON.stringify([defaultUser]))
      }

      // Carregar usuário logado
      const savedCurrentUser = localStorage.getItem("reiner_lojas_current_user")
      if (savedCurrentUser) {
        const parsedCurrentUser = JSON.parse(savedCurrentUser)
        setCurrentUser(parsedCurrentUser)
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error)
      // Em caso de erro, resetar dados
      const defaultUser: User = {
        id: "1",
        name: "João Silva",
        email: "joao@email.com",
        password: "123456",
        createdAt: new Date().toISOString(),
      }
      setUsers([defaultUser])
      localStorage.setItem("reiner_lojas_users", JSON.stringify([defaultUser]))
    }
  }, [])

  // Salvar usuários no localStorage sempre que mudar
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("reiner_lojas_users", JSON.stringify(users))
    }
  }, [users])

  // Salvar usuário atual no localStorage sempre que mudar
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("reiner_lojas_current_user", JSON.stringify(currentUser))
    } else {
      localStorage.removeItem("reiner_lojas_current_user")
    }
  }, [currentUser])

  // Verificar se email já está em uso
  const isEmailTaken = (email: string): boolean => {
    return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
  }

  // Adicionar novo usuário
  const addUser = (name: string, email: string, password: string): boolean => {
    // Verificar se email já existe
    if (isEmailTaken(email)) {
      return false // Email já existe
    }

    // Criar novo usuário
    const newUser: User = {
      id: Date.now().toString(), // ID único baseado no timestamp
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      createdAt: new Date().toISOString(),
    }

    // Adicionar à lista
    setUsers((prevUsers) => [...prevUsers, newUser])
    return true // Sucesso
  }

  // Autenticar usuário
  const authenticateUser = (email: string, password: string): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
    return !!user // Retorna true se encontrou o usuário
  }

  // Fazer login
  const loginUser = (user: { name: string; email: string }) => {
    setCurrentUser(user)
  }

  // Fazer logout
  const logoutUser = () => {
    setCurrentUser(null)
  }

  const value: UserContextType = {
    users,
    currentUser,
    addUser,
    authenticateUser,
    loginUser,
    logoutUser,
    isEmailTaken,
  }

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

// Hook para usar o contexto
export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser deve ser usado dentro de um UserProvider")
  }
  return context
}
