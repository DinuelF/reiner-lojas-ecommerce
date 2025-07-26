"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type User = {
  name: string
  email: string
  password: string
}

type LoginFormProps = {
  onLogin: (user: { name: string; email: string }) => void
  onCancel: () => void
}

// Funções globais para gerenciar usuários
const getUsersFromStorage = (): User[] => {
  if (typeof window === "undefined") return []
  try {
    const users = localStorage.getItem("reiner_lojas_users")
    return users ? JSON.parse(users) : [{ name: "João Silva", email: "joao@email.com", password: "123456" }]
  } catch {
    return [{ name: "João Silva", email: "joao@email.com", password: "123456" }]
  }
}

const saveUsersToStorage = (users: User[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("reiner_lojas_users", JSON.stringify(users))
}

const isEmailTaken = (email: string, users: User[]): boolean => {
  return users.some((user) => user.email.toLowerCase() === email.toLowerCase())
}

const authenticateUser = (email: string, password: string, users: User[]): User | null => {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password) || null
}

export default function LoginForm({ onLogin, onCancel }: LoginFormProps) {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [users, setUsers] = useState<User[]>([])
  const [loginError, setLoginError] = useState("")
  const [registerError, setRegisterError] = useState("")

  // Carregar usuários do localStorage quando o componente montar
  useEffect(() => {
    const loadedUsers = getUsersFromStorage()
    setUsers(loadedUsers)

    // Se não há usuários, criar usuário padrão
    if (loadedUsers.length === 0) {
      const defaultUsers = [{ name: "João Silva", email: "joao@email.com", password: "123456" }]
      setUsers(defaultUsers)
      saveUsersToStorage(defaultUsers)
    }
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    // Validações básicas
    if (!loginData.email || !loginData.password) {
      setLoginError("Por favor, preencha todos os campos")
      return
    }

    // Buscar usuário atual do localStorage
    const currentUsers = getUsersFromStorage()
    const user = authenticateUser(loginData.email, loginData.password, currentUsers)

    if (user) {
      onLogin({ name: user.name, email: user.email })
      // Limpar formulário
      setLoginData({ email: "", password: "" })
      setLoginError("")
    } else {
      setLoginError("Email ou senha incorretos!")
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError("")

    // Validações básicas
    if (!registerData.name || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setRegisterError("Por favor, preencha todos os campos")
      return
    }

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("As senhas não coincidem!")
      return
    }

    if (registerData.password.length < 6) {
      setRegisterError("A senha deve ter pelo menos 6 caracteres")
      return
    }

    // Buscar usuários atuais do localStorage
    const currentUsers = getUsersFromStorage()

    // Verificar se email já existe
    if (isEmailTaken(registerData.email, currentUsers)) {
      setRegisterError("Email já cadastrado")
      alert("Email já cadastrado")
      return
    }

    // Criar novo usuário
    const newUser: User = {
      name: registerData.name.trim(),
      email: registerData.email.toLowerCase().trim(),
      password: registerData.password,
    }

    // Adicionar à lista de usuários
    const updatedUsers = [...currentUsers, newUser]
    setUsers(updatedUsers)
    saveUsersToStorage(updatedUsers)

    // Fazer login automaticamente
    onLogin({ name: newUser.name, email: newUser.email })

    // Limpar formulário
    setRegisterData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setRegisterError("")

    alert("Conta criada com sucesso!")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Acesso à Reiner Lojas</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className={loginError ? "border-red-500" : ""}
                    placeholder="Digite seu email"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password">Senha</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className={loginError ? "border-red-500" : ""}
                    placeholder="Digite sua senha"
                  />
                </div>

                {loginError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{loginError}</div>}

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Entrar
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Usuário de teste:</strong>
                  <br />
                  Email: joao@email.com
                  <br />
                  Senha: 123456
                </p>
                <p className="text-xs text-blue-600 mt-2">Total de usuários cadastrados: {users.length}</p>
              </div>
            </TabsContent>

            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name">Nome Completo</Label>
                  <Input
                    id="register-name"
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                    placeholder="Digite seu nome completo"
                    className={registerError ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                    placeholder="Digite seu email"
                    className={registerError ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="register-password">Senha</Label>
                  <Input
                    id="register-password"
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                    placeholder="Mínimo 6 caracteres"
                    className={registerError ? "border-red-500" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="register-confirm">Confirmar Senha</Label>
                  <Input
                    id="register-confirm"
                    type="password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    required
                    placeholder="Digite a senha novamente"
                    className={registerError ? "border-red-500" : ""}
                  />
                </div>

                {registerError && <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{registerError}</div>}

                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    Cadastrar
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
