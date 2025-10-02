import React, { useState } from 'react';
import { ShoppingBag, Star, ShoppingCart, Filter, Search, Heart, TrendingUp } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
  reviews: number;
  image: string;
  badge?: string;
  inStock: boolean;
}

const StorePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState<string[]>([]);

  const categories = [
    { id: 'all', label: 'Todo', icon: ShoppingBag },
    { id: 'supplements', label: 'Suplementos', icon: TrendingUp },
    { id: 'clothing', label: 'Ropa', icon: ShoppingBag },
    { id: 'equipment', label: 'Equipo', icon: TrendingUp },
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Proteína Whey Premium',
      price: 899,
      category: 'supplements',
      rating: 4.8,
      reviews: 234,
      image: '💪',
      badge: 'Más vendido',
      inStock: true
    },
    {
      id: '2',
      name: 'Creatina Monohidrato 500g',
      price: 549,
      category: 'supplements',
      rating: 4.9,
      reviews: 189,
      image: '⚡',
      badge: 'Nuevo',
      inStock: true
    },
    {
      id: '3',
      name: 'Camiseta Deportiva Premium',
      price: 349,
      category: 'clothing',
      rating: 4.7,
      reviews: 156,
      image: '👕',
      inStock: true
    },
    {
      id: '4',
      name: 'Shorts de Entrenamiento',
      price: 299,
      category: 'clothing',
      rating: 4.6,
      reviews: 98,
      image: '🩳',
      inStock: true
    },
    {
      id: '5',
      name: 'Guantes de Gimnasio',
      price: 199,
      category: 'equipment',
      rating: 4.5,
      reviews: 167,
      image: '🧤',
      inStock: true
    },
    {
      id: '6',
      name: 'Botella Shaker 700ml',
      price: 149,
      category: 'equipment',
      rating: 4.8,
      reviews: 421,
      image: '🍶',
      badge: 'Popular',
      inStock: true
    },
    {
      id: '7',
      name: 'Pre-Workout Extreme',
      price: 649,
      category: 'supplements',
      rating: 4.7,
      reviews: 203,
      image: '🔥',
      inStock: true
    },
    {
      id: '8',
      name: 'Correa de Levantamiento',
      price: 279,
      category: 'equipment',
      rating: 4.9,
      reviews: 145,
      image: '⛓️',
      badge: 'Premium',
      inStock: false
    },
  ];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (productId: string) => {
    if (!cart.includes(productId)) {
      setCart([...cart, productId]);
    }
  };

  return (
    <div className="pb-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black text-zinc-900 mb-2">
          Tienda 🛍️
        </h1>
        <p className="text-zinc-600">Encuentra todo lo que necesitas para tu entrenamiento</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-zinc-200 bg-white focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-zinc-200 p-4 hover:shadow-lg transition-all relative overflow-hidden group"
          >
            {/* Badge */}
            {product.badge && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                {product.badge}
              </div>
            )}

            {/* Favorite Button */}
            <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all z-10">
              <Heart className="h-4 w-4 text-zinc-400 hover:text-red-500 transition-colors" />
            </button>

            {/* Product Image */}
            <div className="w-full aspect-square bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-xl mb-3 flex items-center justify-center text-6xl">
              {product.image}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <h3 className="font-semibold text-zinc-900 text-sm line-clamp-2">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-medium text-zinc-900">{product.rating}</span>
                <span className="text-xs text-zinc-400">({product.reviews})</span>
              </div>

              {/* Price & Stock */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-black text-zinc-900">
                    ${product.price}
                  </p>
                  <p className="text-xs text-zinc-400">MXN</p>
                </div>

                {product.inStock ? (
                  <button
                    onClick={() => addToCart(product.id)}
                    disabled={cart.includes(product.id)}
                    className={`p-2.5 rounded-xl transition-all ${
                      cart.includes(product.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 active:scale-95'
                    }`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                  </button>
                ) : (
                  <span className="text-xs text-red-500 font-semibold">Agotado</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Floating Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-20 right-4 z-50">
          <button className="relative flex items-center gap-2 bg-gradient-to-br from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-full shadow-2xl hover:from-cyan-400 hover:to-blue-500 transition-all active:scale-95">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-bold">{cart.length}</span>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
              {cart.length}
            </div>
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag className="h-16 w-16 text-zinc-300 mx-auto mb-4" />
          <p className="text-zinc-500 font-medium">No hay productos en esta categoría</p>
        </div>
      )}
    </div>
  );
};

export default StorePage;
