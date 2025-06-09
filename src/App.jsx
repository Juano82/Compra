// Código completo con descuento estimado agregado
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
  { id: 1, name: "MAXICONSUMO", promotion: "25% de descuento", minAmount: 88000, discountAmount: 22000, promoDay: "TODOS LOS DÍAS", paymentMethod: "qr o tarjeta" },
  { id: 2, name: "VITAL", promotion: "25% de descuento", minAmount: 84000, discountAmount: 21000, promoDay: "MIÉRCOLES Y JUEVES", paymentMethod: "tarjeta" },
  { id: 3, name: "DIA%", promotion: "25% de descuento", minAmount: 96000, discountAmount: 24000, promoDay: "JUEVES", paymentMethod: "qr o tarjeta" },
  { id: 4, name: "MAKRO", promotion: "25% de descuento", minAmount: 84000, discountAmount: 21000, promoDay: "MIÉRCOLES Y JUEVES", paymentMethod: "tarjeta" }
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
  const { toast } = useToast();
  const [factor, setFactor] = useState(1);

  useEffect(() => {
    try {
      localStorage.setItem("shoppingList", JSON.stringify(items));
    } catch (error) {
      console.error("Error saving items to localStorage:", error);
    }
  }, [items]);

  const formatPrice = (price) => (typeof price === 'number' ? price.toFixed(2) : "0.00");

  const sumaOriginal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const totalCompra = sumaOriginal * factor;
  const supermarket = SUPERMARKETS.find(s => s.id === selectedSupermarket);
  const remainingForPromo = supermarket ? Math.max(0, supermarket.minAmount - totalCompra) : 0;
  const descuentoObtenido = supermarket && totalCompra >= supermarket.minAmount
    ? supermarket.discountAmount * factor
    : 0;

  return (
    <div className="shopping-list min-h-screen">
      {/* ... contenido anterior ... */}

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
              <>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Falta para promoción:</span>
                  <span className={`text-lg font-bold ${remainingForPromo === 0 ? 'text-green-300' : 'text-orange-300'}`}>
                    ${formatPrice(remainingForPromo)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm">Descuento estimado:</span>
                  <span className={`text-lg font-bold ${descuentoObtenido > 0 ? 'text-green-300' : 'text-gray-400'}`}>
                    ${formatPrice(descuentoObtenido)}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-end mt-2">
              <Button
                type="button"
                variant={factor === 2 ? "default" : "outline"}
                size="sm"
                onClick={() => setFactor(factor === 2 ? 1 : 2)}
              >
                {factor === 2 ? "x2" : "x1"}
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <Toaster />
    </div>
  );
}

export default App;
