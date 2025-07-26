"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, UserIcon, LogOut } from "lucide-react"
import LoginForm from "@/components/login-form"
import CartModal from "@/components/cart-modal"
import ClientWrapper from "@/components/client-wrapper"

// Simulando dados do banco de dados com imagens locais
const initialProducts = [
  // Camisetas
  {
    id: 1,
    name: "Camiseta Básica Branca",
    price: 29.9,
    category: "camisetas",
    stock: 20,
    image: "/images/produtos/camisetas/camiseta-branca.jpg",
  },
  {
    id: 2,
    name: "Camiseta Estampada Azul",
    price: 39.9,
    category: "camisetas",
    stock: 15,
    image: "/images/produtos/camisetas/camiseta-azul.jpg",
  },
  {
    id: 3,
    name: "Camiseta Polo Preta",
    price: 49.9,
    category: "camisetas",
    stock: 10,
    image: "/images/produtos/camisetas/camiseta-preta.jpg",
  },
  {
    id: 4,
    name: "Camiseta Manga Longa Verde",
    price: 44.9,
    category: "camisetas",
    stock: 15,
    image: "/images/produtos/camisetas/camiseta-verde.jpg",
  },

  // Tênis
  {
    id: 5,
    name: "Tênis Esportivo Nike",
    price: 199.9,
    category: "tenis",
    stock: 10,
    image: "/images/produtos/tenis/tenis-nike.jpg",
  },
  {
    id: 6,
    name: "Tênis Casual Adidas",
    price: 179.9,
    category: "tenis",
    stock: 10,
    image: "/images/produtos/tenis/tenis-adidas.jpg",
  },
  {
    id: 7,
    name: "Tênis Running Puma",
    price: 159.9,
    category: "tenis",
    stock: 20,
    image: "/images/produtos/tenis/tenis-puma.jpg",
  },
  {
    id: 8,
    name: "Tênis Skateboard Vans",
    price: 149.9,
    category: "tenis",
    stock: 10,
    image: "/images/produtos/tenis/tenis-vans.jpg",
  },

  // Calças
  {
    id: 9,
    name: "Calça Jeans Azul",
    price: 89.9,
    category: "calcas",
    stock: 15,
    image: "/images/produtos/calcas/calca-jeans.jpg",
  },
  {
    id: 10,
    name: "Calça Social Preta",
    price: 119.9,
    category: "calcas",
    stock: 15,
    image: "/images/produtos/calcas/calca-social.jpg",
  },
  {
    id: 11,
    name: "Calça Cargo Bege",
    price: 99.9,
    category: "calcas",
    stock: 20,
    image: "/images/produtos/calcas/calca-cargo.jpg",
  },
  {
    id: 12,
    name: "Calça Legging Preta",
    price: 59.9,
    category: "calcas",
    stock: 15,
    image: "/images/produtos/calcas/calca-legging.jpg",
  },
]

type Product = {
  id: number
  name: string
  price: number
  category: string
  stock: number
  image: string
}

type CartItem = {
  product: Product
  quantity: number
}

type UserData = {
  name: string
  email: string
}

// Função global para gerenciar usuários
const getUsersFromStorage = () => {
  if (typeof window === "undefined") return []
  try {
    const users = localStorage.getItem("reiner_lojas_users")
    return users ? JSON.parse(users) : [{ name: "João Silva", email: "joao@email.com", password: "123456" }]
  } catch {
    return [{ name: "João Silva", email: "joao@email.com", password: "123456" }]
  }
}

const saveUsersToStorage = (users: any[]) => {
  if (typeof window === "undefined") return
  localStorage.setItem("reiner_lojas_users", JSON.stringify(users))
}

export default function EcommercePage() {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts)
  const [selectedCategory, setSelectedCategory] = useState<string>("todos")
  const [user, setUser] = useState<UserData | null>(null)
  const [showLogin, setShowLogin] = useState(false)
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)

  const categories = [
    { key: "todos", label: "Todos os Produtos" },
    { key: "camisetas", label: "Camisetas" },
    { key: "tenis", label: "Tênis" },
    { key: "calcas", label: "Calças" },
  ]

  // Inicializar usuários padrão se não existirem
  useEffect(() => {
    const users = getUsersFromStorage()
    if (users.length === 0) {
      saveUsersToStorage([{ name: "João Silva", email: "joao@email.com", password: "123456" }])
    }
  }, [])

  useEffect(() => {
    if (selectedCategory === "todos") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((product) => product.category === selectedCategory))
    }
  }, [selectedCategory, products])

  const handleLogin = (userData: UserData) => {
    setUser(userData)
    setShowLogin(false)
  }

  const handleLogout = () => {
    setUser(null)
    setCart([])
  }

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id)
      if (existingItem) {
        if (existingItem.quantity < product.stock) {
          return prevCart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        }
        return prevCart
      } else {
        return [...prevCart, { product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId))
  }

  const updateCartQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) => prevCart.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const finalizePurchase = () => {
    // Atualizar estoque
    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        const cartItem = cart.find((item) => item.product.id === product.id)
        if (cartItem) {
          return { ...product, stock: product.stock - cartItem.quantity }
        }
        return product
      }),
    )

    // Limpar carrinho
    setCart([])
    setShowCart(false)
    alert("Compra finalizada com sucesso!")
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  if (showLogin) {
    return <LoginForm onLogin={handleLogin} onCancel={() => setShowLogin(false)} />
  }

  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold text-gray-900">Reiner Lojas</h1>

              <div className="flex items-center space-x-4">
                {user ? (
                  <>
                    <span className="text-sm text-gray-600">
                      Conectado como <strong>{user.name}</strong>
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setShowCart(true)} className="relative">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Carrinho
                      {getTotalItems() > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                          {getTotalItems()}
                        </Badge>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setShowLogin(true)}>
                    <UserIcon className="h-4 w-4 mr-2" />
                    Entrar
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-8 py-4">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category.key
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Products Grid */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        // Se a imagem não carregar, mostra um placeholder
                        e.currentTarget.src =
                          "/placeholder.svg?height=200&width=200&text=" + encodeURIComponent(product.name)
                      }}
                      loading="lazy"
                    />
                    {/* Badge de categoria */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {product.category === "camisetas" && "Camiseta"}
                        {product.category === "tenis" && "Tênis"}
                        {product.category === "calcas" && "Calça"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-2xl font-bold text-green-600">R$ {product.price.toFixed(2)}</span>
                    <Badge variant={product.stock > 5 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                      {product.stock > 0 ? `Estoque: ${product.stock}` : "Sem estoque"}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    className="w-full"
                    onClick={() => addToCart(product)}
                    disabled={!user || product.stock <= 0}
                    variant={product.stock <= 0 ? "secondary" : "default"}
                  >
                    {!user ? "Faça login para comprar" : product.stock <= 0 ? "Sem estoque" : "Adicionar ao Carrinho"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </main>

        {/* Cart Modal */}
        {showCart && (
          <CartModal
            cart={cart}
            onClose={() => setShowCart(false)}
            onRemoveItem={removeFromCart}
            onUpdateQuantity={updateCartQuantity}
            onFinalizePurchase={finalizePurchase}
            totalPrice={getTotalPrice()}
          />
        )}
      </div>
    </ClientWrapper>
  )
}
