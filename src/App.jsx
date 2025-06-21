import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, ShoppingCart, CreditCard, Pencil, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SUPERMARKETS = [
  {
    id: 1,
    name: "MAXICONSUMO",
    promotion: "25% de descuento",
    minAmount: 88000,
    discountAmount: 22000,
    promoDay: "TODOS LOS DÍAS",
    paymentMethod: "qr o tarjeta"
  },
  {
    id: 2,
    name: "VITAL",
    promotion: "25% de descuento",
    minAmount: 84000,
    discountAmount: 21000,
    promoDay: "MIÉRCOLES Y JUEVES",
    paymentMethod: "tarjeta"
  },
  {
    id: 3,
    name: "DIA%",
    promotion: "25% de descuento",
    minAmount: 96000,
    discountAmount: 24000,
    promoDay: "JUEVES",
    paymentMethod: "qr o tarjeta"
  },
  {
    id: 4,
    name: "MAKRO",
    promotion: "25% de descuento",
    minAmount: 84000,
    discountAmount: 21000,
    promoDay: "MIÉRCOLES Y JUEVES",
    paymentMethod: "tarjeta"
  }
];

function App() {
  const [items, setItems] = useState(() => {
    try {
      const savedItems = localStorage.getItem("shoppingList");
      return savedItems ? JSON.parse(savedItems) : [];
    } catch (error) {
      console.error("Error loading items from localStorage:", error);
      return [];
    }
  });

  const [newItem, setNewItem] = useState("");
  const [editingItem, setEditingItem] = useState(null);
  const [selectedSupermarket, setSelectedSupermarket] = useState(null);
  const [duplicarPromo, setDuplicarPromo] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem("shoppingList", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving items to localStorage:", error);
    }
  }, [items]);

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toFixed(2) : "0.00";
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un producto",
        variant: "destructive",
      });
      return;
    }

    const newItemObject = {
      id: Date.now(),
      name: newItem.trim(),
      completed: false,
      price: 0,
      quantity: 1,
      total: 0
    };

    setItems([...items, newItemObject]);
    setNewItem("");
    toast({
      title: "¡Producto agregado!",
      description: `${newItemObject.name} fue agregado a tu lista`,
    });
  };

  const toggleItem = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const removeItem = (id, name) => {
    setItems(items.filter(item => item.id !== id));
    toast({
      title: "Producto eliminado",
      description: `${name} fue eliminado de tu lista`,
      variant: "destructive",
    });
  };

  const startEditing = (item) => {
    setEditingItem({ ...item });
  };

  const updateItem = (e, id) => {
    e.preventDefault();
    const updatedItem = editingItem;

    if (!updatedItem.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre del producto no puede estar vacío",
        variant: "destructive",
      });
      return;
    }

    setItems(items.map(item =>
      item.id === id ? {
        ...item,
        ...updatedItem,
        total: (updatedItem.price || 0) * (updatedItem.quantity || 1)
      } : item
    ));
    setEditingItem(null);
    toast({
      title: "Producto actualizado",
      description: "Los cambios fueron guardados",
    });
  };

  const totalCompra = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const supermarket = SUPERMARKETS.find(s => s.id === selectedSupermarket);
  const minAmountTope = supermarket
    ? supermarket.minAmount * (duplicarPromo ? 2 : 1)
    : 0;
  const discountAmountTope = supermarket
    ? supermarket.discountAmount * (duplicarPromo ? 2 : 1)
    : 0;
  const remainingForPromo = supermarket
    ? Math.max(0, minAmountTope - totalCompra)
    : 0;

  return (
    <div className="shopping-list min-h-screen">
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="list-header flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-6 h-6" />
        <h1>Compras</h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="supermarket-card"
      >
        <div className="flex items-center gap-2 mb-2">
          <Store className="w-4 h-4" />
          <h2 className="text-sm font-semibold">Supermercado</h2>
        </div>
        <Select onValueChange={(value) => setSelectedSupermarket(Number(value))}>
          <SelectTrigger className="supermarket-select">
            <SelectValue placeholder="Elige un supermercado" />
          </SelectTrigger>
          <SelectContent>
            {SUPERMARKETS.map((market) => (
              <SelectItem key={market.id} value={market.id.toString()}>
                {market.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {supermarket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-2"
          >
            <div className="flex items-center justify-between">
              <div className="promotion-tag">
                <span className="mr-1">🏷️</span>
                {supermarket.promotion}
              </div>
              <span className="payment-method">
                <CreditCard className="w-3 h-3 mr-1" />
                {supermarket.paymentMethod}
              </span>
            </div>
            <div className="promo-info flex flex-col gap-1">
              <span>Días: {supermarket.promoDay}</span>
              <span>
                Min: ${formatPrice(minAmountTope)}
                {duplicarPromo && <span className="ml-1 text-xs text-green-600">(x2)</span>}
              </span>
              <span>
                Descuento: ${formatPrice(discountAmountTope)}
                {duplicarPromo && <span className="ml-1 text-xs text-green-600">(x2)</span>}
              </span>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                id="duplicarPromo"
                checked={duplicarPromo}
                onChange={() => setDuplicarPromo(!duplicarPromo)}
                className="mr-2"
              />
              <label htmlFor="duplicarPromo" className="text-sm">
                Duplicar saldo tope de promo
              </label>
            </div>
          </motion.div>
        )}
      </motion.div>

      <form onSubmit={addItem} className="add-item-form glass-card">
        <div className="flex gap-2">
          <Input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Agregar producto..."
            className="flex-1"
          />
          <Button type="submit" size="sm">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <div className="item-list">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className={`item-card ${editingItem?.id === item.id ? 'edit-mode' : ''}`}
            >
              {editingItem?.id === item.id ? (
                <form onSubmit={(e) => updateItem(e, item.id)} className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                      className="flex-1 h-8 text-sm"
                    />
                    <Input
                      type="number"
                      value={editingItem.price || ""}
                      onChange={(e) => setEditingItem({
                        ...editingItem,
                        price: parseFloat(e.target.value) || 0
                      })}
                      placeholder="Precio"
                      className="w-24 h-8 text-sm"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setEditingItem({
                          ...editingItem,
                          quantity: Math.max(1, (editingItem.quantity || 1) - 1)
                        })}
                      >
                        -
                      </Button>
                      <span className="w-8 text-center text-sm">{editingItem.quantity || 1}</span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => setEditingItem({
                          ...editingItem,
                          quantity: (editingItem.quantity || 1) + 1
                        })}
                      >
                        +
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" size="sm" className="h-8">Guardar</Button>
                      <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => setEditingItem(null)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="compact-item">
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => toggleItem(item.id)}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className={`text-sm ${item.completed ? "line-through text-gray-500" : ""}`}>
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {(item.price > 0 || item.quantity > 1) && (
                      <span className="text-xs text-gray-600">
                        ${formatPrice(item.price)} × {item.quantity}
                        <span className="ml-2 font-medium">${formatPrice(item.total)}</span>
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(item)}
                      className="h-7 w-7 p-0 text-blue-500 hover:text-blue-700"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id, item.name)}
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-0 left-0 right-0 p-4"
        >
          <div className="max-w-md mx-auto budget-info rounded-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm">Total de la compra:</span>
              <span className="text-lg font-bold">${formatPrice(totalCompra)}</span>
            </div>
            {supermarket && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Falta para promoción:</span>
                <span className={`text-lg font-bold ${remainingForPromo === 0 ? 'text-green-300' : 'text-orange-300'}`}>
                  ${formatPrice(remainingForPromo)}
                </span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      <Toaster />
    </div>
  );
}

export default App;
