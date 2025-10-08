
import React, { useState } from 'react';
import Icon from '@/ui/Icon';

interface Product {
  id: string;
  name: string;
  price: number;
  category: 'supplements' | 'clothing' | 'equipment';
  stock: number;
  image: string;
  description: string;
  isActive: boolean;
}

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Proteína Whey Premium',
      price: 899,
      category: 'supplements',
      stock: 45,
      image: '💪',
      description: 'Proteína de suero de alta calidad',
      isActive: true
    },
    {
      id: '2',
      name: 'Creatina Monohidrato 500g',
      price: 549,
      category: 'supplements',
      stock: 32,
      image: '⚡',
      description: 'Creatina pura micronizada',
      isActive: true
    },
    {
      id: '3',
      name: 'Camiseta Deportiva Premium',
      price: 349,
      category: 'clothing',
      stock: 78,
      image: '👕',
      description: 'Tecnología Dry-Fit',
      isActive: true
    },
  ]);

  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    category: 'supplements' as Product['category'],
    stock: 0,
    image: '📦',
    description: ''
  });

  const handleAddProduct = () => {
    const product: Product = {
      id: `prod-${Date.now()}`,
      ...newProduct,
      isActive: true
    };
    setProducts([...products, product]);
    setAddModalOpen(false);
    setNewProduct({
      name: '',
      price: 0,
      category: 'supplements',
      stock: 0,
      image: '📦',
      description: ''
    });
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const toggleProductStatus = (id: string) => {
    setProducts(products.map(p =>
      p.id === id ? { ...p, isActive: !p.isActive } : p
    ));
  };

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const activeProducts = products.filter(p => p.isActive).length;
  const lowStockProducts = products.filter(p => p.stock < 10).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión de Tienda</h1>
          <p className="text-gray-500">Administra productos, inventario y ventas</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Icon name="Plus" className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Total Productos</h3>
            <Icon name="Package" className="w-5 h-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-white">{products.length}</p>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Productos Activos</h3>
            <Icon name="CheckCircle" className="w-5 h-5 text-accent-green" />
          </div>
          <p className="text-3xl font-bold text-white">{activeProducts}</p>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Stock Total</h3>
            <Icon name="Archive" className="w-5 h-5 text-accent-blue" />
          </div>
          <p className="text-3xl font-bold text-white">{totalStock}</p>
        </div>

        <div className="stats-card">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-500">Stock Bajo</h3>
            <Icon name="AlertTriangle" className="w-5 h-5 text-accent-orange" />
          </div>
          <p className="text-3xl font-bold text-white">{lowStockProducts}</p>
        </div>
      </div>

      {/* Products Table */}
      <div className="glass-card">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white mb-4">Productos</h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-zinc-800">
                  <th className="pb-3 text-sm font-semibold text-gray-500">Producto</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Categoría</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Precio</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Stock</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Estado</th>
                  <th className="pb-3 text-sm font-semibold text-gray-500">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex items-center justify-center text-2xl bg-zinc-800 rounded-lg">
                          {product.image}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{product.name}</p>
                          <p className="text-sm text-gray-500">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-4">
                      <p className="font-bold text-white">${product.price}</p>
                      <p className="text-xs text-gray-500">MXN</p>
                    </td>
                    <td className="py-4">
                      <p className={`font-bold ${product.stock < 10 ? 'text-accent-orange' : 'text-white'}`}>
                        {product.stock}
                      </p>
                      {product.stock < 10 && (
                        <p className="text-xs text-accent-orange">Stock bajo</p>
                      )}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => toggleProductStatus(product.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                          product.isActive
                            ? 'bg-accent-green/20 text-accent-green'
                            : 'bg-zinc-800 text-gray-500'
                        }`}
                      >
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Icon name="Edit" className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
                        >
                          <Icon name="Trash2" className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Agregar Producto</h2>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <Icon name="X" className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="input-field"
                    placeholder="Ej: Proteína Whey"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Precio (MXN)</label>
                    <input
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Stock</label>
                    <input
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Categoría</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as Product['category'] })}
                    className="input-field"
                  >
                    <option value="supplements">Suplementos</option>
                    <option value="clothing">Ropa</option>
                    <option value="equipment">Equipo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Emoji/Imagen</label>
                  <input
                    type="text"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="input-field"
                    placeholder="📦"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Descripción</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="input-field"
                    rows={3}
                    placeholder="Descripción del producto..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 px-6 py-3 rounded-xl border border-zinc-800 hover:bg-zinc-900/50 text-white font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 btn-primary"
                  >
                    Agregar Producto
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store;
