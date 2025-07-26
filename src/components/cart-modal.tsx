"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, Trash2 } from "lucide-react"

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

type CartModalProps = {
  cart: CartItem[]
  onClose: () => void
  onRemoveItem: (productId: number) => void
  onUpdateQuantity: (productId: number, quantity: number) => void
  onFinalizePurchase: () => void
  totalPrice: number
}

export default function CartModal({
  cart,
  onClose,
  onRemoveItem,
  onUpdateQuantity,
  onFinalizePurchase,
  totalPrice,
}: CartModalProps) {
  if (cart.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Carrinho de Compras</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-500 py-8">Seu carrinho está vazio</p>
            <Button onClick={onClose} className="w-full">
              Continuar Comprando
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Carrinho de Compras</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-96">
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-medium">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">R$ {item.product.price.toFixed(2)} cada</p>
                  <Badge variant="outline" className="mt-1">
                    Estoque disponível: {item.product.stock}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                    disabled={item.quantity >= item.product.stock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveItem(item.product.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <div className="p-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Total:</span>
            <span className="text-2xl font-bold text-green-600">R$ {totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Continuar Comprando
            </Button>
            <Button onClick={onFinalizePurchase} className="flex-1">
              Finalizar Compra
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
