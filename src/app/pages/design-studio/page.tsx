'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import CategoryProducts from "../../components/CategoryProducts";

// Mock data for fabric cards
const fabricData = [
  {
    id: 1,
    name: "Cotton Twill",
    pattern: "Diagonal Weave",
    weight: "Medium",
    color: "Natural",
    stock: "1500m",
    image: "/fabrics/cotton-twill.jpg",
    description: "Soft and durable cotton twill fabric with a diagonal weave pattern. Perfect for casual wear and work uniforms.",
    composition: "100% Cotton",
    width: "58 inches",
    care: "Machine wash cold, tumble dry low"
  },
  {
    id: 2,
    name: "Silk Chiffon",
    pattern: "Plain Weave",
    weight: "Light",
    color: "Ivory",
    stock: "800m",
    image: "/fabrics/silk-chiffon.jpg",
    description: "Luxurious silk chiffon with a delicate drape. Ideal for evening wear and bridal garments.",
    composition: "100% Silk",
    width: "45 inches",
    care: "Dry clean only"
  },
  {
    id: 3,
    name: "Denim Stretch",
    pattern: "Twill",
    weight: "Heavy",
    color: "Indigo",
    stock: "2000m",
    image: "/fabrics/denim-stretch.jpg",
    description: "Comfortable stretch denim with excellent recovery. Great for modern jeans and jackets.",
    composition: "98% Cotton, 2% Spandex",
    width: "60 inches",
    care: "Machine wash cold, hang dry"
  },
  {
    id: 4,
    name: "Linen Blend",
    pattern: "Plain Weave",
    weight: "Medium",
    color: "Ecru",
    stock: "1200m",
    image: "/fabrics/linen-blend.jpg",
    description: "Breathable linen blend with minimal wrinkling. Perfect for summer collections.",
    composition: "70% Linen, 30% Cotton",
    width: "55 inches",
    care: "Machine wash warm, tumble dry low"
  }
];

// Mock data for RMG seasonal collections
const seasonalData = {
  current: [
    { id: 1, name: "Spring Collection 2024", items: 45, launch: "Active" },
    { id: 2, name: "Workwear Essentials", items: 32, launch: "Active" }
  ],
  seasonal: [
    { id: 1, name: "Summer Vibes 2024", items: 28, launch: "June 2024" },
    { id: 2, name: "Resort Collection", items: 15, launch: "May 2024" }
  ],
  upcoming: [
    { id: 1, name: "Fall Winter 2024", items: 0, launch: "August 2024" },
    { id: 2, name: "Holiday Collection", items: 0, launch: "October 2024" }
  ]
};

export default function DesignStudio() {
  const [activeTab, setActiveTab] = useState<'studio' | 'fabric' | 'rmg'>('rmg');
  const [studioSubTab, setStudioSubTab] = useState<'portfolio' | 'banner' | 'design-tools'>('portfolio');
  const [fabricSubTab, setFabricSubTab] = useState<'patterns' | 'weaving' | 'stock'>('stock');
  const [rmgSubTab, setRmgSubTab] = useState<'current' | 'seasonal' | 'upcoming'>('current');
  const [selectedFabric, setSelectedFabric] = useState<any>(null);
  const [isFabricModalOpen, setIsFabricModalOpen] = useState(false);

  const handleFabricClick = (fabric: any) => {
    setSelectedFabric(fabric);
    setIsFabricModalOpen(true);
  };

  const closeFabricModal = () => {
    setIsFabricModalOpen(false);
    setSelectedFabric(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      {/* Compact Header */}
      <div className="bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="container mx-auto p-2">
          <motion.h1 
            className="text-2xl md:text-3xl font-black text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Design Studio
          </motion.h1>
        </div>
      </div>

      {/* Compact Main Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-3">
          <div className="flex space-x-1">
            {[
              { id: 'studio', label: 'Studio', icon: '🎨' },
              { id: 'fabric', label: 'Fabric', icon: '🧵' },
              { id: 'rmg', label: 'RMG', icon: '👕' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 text-xs font-semibold transition-all duration-200 border-b-2 flex items-center justify-center gap-1 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span className="text-base">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sub Tabs and Content */}
      <div className="container mx-auto p-2">
        {/* Studio Sub Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'studio' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex space-x-1 mb-4 bg-white/60 backdrop-blur-sm rounded-md p-1 border border-slate-200">
                {[
                  { id: 'portfolio', label: 'Portfolio', icon: '📁' },
                  { id: 'banner', label: 'Banner', icon: '🖼️' },
                  { id: 'design-tools', label: 'Tools', icon: '⚡' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setStudioSubTab(tab.id as any)}
                    className={`flex-1 py-2 px-2 text-xs font-medium rounded-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                      studioSubTab === tab.id
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Studio Content */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 p-4">
                {studioSubTab === 'portfolio' && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">📁</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Design Portfolio</h3>
                    <p className="text-slate-600 text-sm mb-4">Browse through our collection of design projects.</p>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm">
                      View Portfolio
                    </button>
                  </div>
                )}

                {studioSubTab === 'banner' && (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">🖼️</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2">Studio Banner</h3>
                    <p className="text-slate-600 text-sm mb-4">Customize your studio banner and branding.</p>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm">
                      Manage Banner
                    </button>
                  </div>
                )}

                {studioSubTab === 'design-tools' && (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-3">⚡</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Design Tools</h3>
                    <div className="grid grid-cols-3 gap-2 max-w-md mx-auto">
                      <button className="p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors duration-200">
                        <div className="text-xl mb-1">🎯</div>
                        <span className="text-xs font-medium">Patterns</span>
                      </button>
                      <button className="p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors duration-200">
                        <div className="text-xl mb-1">🎨</div>
                        <span className="text-xs font-medium">Colors</span>
                      </button>
                      <button className="p-2 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors duration-200">
                        <div className="text-xl mb-1">📐</div>
                        <span className="text-xs font-medium">Design</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fabric Sub Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'fabric' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex space-x-1 mb-4 bg-white/60 backdrop-blur-sm rounded-md p-1 border border-slate-200">
                {[
                  { id: 'patterns', label: 'Patterns', icon: '🔸' },
                  { id: 'weaving', label: 'Weaving', icon: '🏭' },
                  { id: 'stock', label: 'Stock', icon: '📦' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setFabricSubTab(tab.id as any)}
                    className={`flex-1 py-2 px-2 text-xs font-medium rounded-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                      fabricSubTab === tab.id
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Fabric Content */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 p-4">
                {fabricSubTab === 'patterns' && (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">🧵</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Pattern Types</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-w-2xl mx-auto">
                      {['Plain', 'Twill', 'Satin', 'Jacquard', 'Dobby', 'Leno', 'Pile', 'Double'].map((pattern) => (
                        <div key={pattern} className="p-2 bg-slate-100 rounded-md text-center">
                          <div className="text-lg mb-1">🔸</div>
                          <span className="font-medium text-xs">{pattern}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {fabricSubTab === 'weaving' && (
                  <div className="text-center py-6">
                    <div className="text-4xl mb-3">🏭</div>
                    <h3 className="text-lg font-bold text-slate-800 mb-3">Weaving Process</h3>
                    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-blue-50 rounded-md">
                        <div className="text-lg mb-2">1</div>
                        <h4 className="font-bold text-slate-800 mb-1 text-sm">Yarn Prep</h4>
                        <p className="text-slate-600 text-xs">Quality yarn selection</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-md">
                        <div className="text-lg mb-2">2</div>
                        <h4 className="font-bold text-slate-800 mb-1 text-sm">Weaving</h4>
                        <p className="text-slate-600 text-xs">Precision weaving</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-md">
                        <div className="text-lg mb-2">3</div>
                        <h4 className="font-bold text-slate-800 mb-1 text-sm">Finishing</h4>
                        <p className="text-slate-600 text-xs">Quality control</p>
                      </div>
                    </div>
                  </div>
                )}

                {fabricSubTab === 'stock' && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Fabric Stock</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {fabricData.map((fabric) => (
                        <motion.div
                          key={fabric.id}
                          className="bg-white rounded-md shadow-xs border border-slate-200 overflow-hidden hover:shadow-sm transition-all duration-200 cursor-pointer"
                          whileHover={{ y: -2 }}
                          onClick={() => handleFabricClick(fabric)}
                        >
                          <div className="h-32 bg-slate-200 relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center">
                              <span className="text-3xl">🧵</span>
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-bold text-slate-800 text-sm mb-1">{fabric.name}</h4>
                            <div className="space-y-1 text-xs text-slate-600">
                              <div className="flex justify-between">
                                <span>Pattern:</span>
                                <span className="font-medium">{fabric.pattern}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Stock:</span>
                                <span className="font-medium text-green-600">{fabric.stock}</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RMG Sub Tabs */}
        <AnimatePresence mode="wait">
          {activeTab === 'rmg' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <div className="flex space-x-1 mb-4 bg-white/60 backdrop-blur-sm rounded-md p-1 border border-slate-200">
                {[
                  { id: 'current', label: 'Current', icon: '🔄' },
                  { id: 'seasonal', label: 'Seasonal', icon: '🌞' },
                  { id: 'upcoming', label: 'Upcoming', icon: '🚀' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setRmgSubTab(tab.id as any)}
                    className={`flex-1 py-2 px-2 text-xs font-medium rounded-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                      rmgSubTab === tab.id
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    <span className="text-sm">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* RMG Content */}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 overflow-hidden">
                {rmgSubTab === 'current' && (
                  <div className="relative">
                    <CategoryProducts />
                  </div>
                )}
                
                {rmgSubTab === 'seasonal' && (
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Seasonal Collections</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {seasonalData.seasonal.map((collection) => (
                        <div key={collection.id} className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-200">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-slate-800 text-sm">{collection.name}</h4>
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Seasonal
                            </span>
                          </div>
                          <div className="space-y-1 text-slate-600 text-xs">
                            <div className="flex justify-between">
                              <span>Items:</span>
                              <span className="font-medium">{collection.items} designs</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Launch:</span>
                              <span className="font-medium">{collection.launch}</span>
                            </div>
                          </div>
                          <button className="w-full mt-3 bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors duration-200 text-xs font-medium">
                            View Collection
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {rmgSubTab === 'upcoming' && (
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Collections</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {seasonalData.upcoming.map((collection) => (
                        <div key={collection.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-bold text-slate-800 text-sm">{collection.name}</h4>
                            <span className="bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Upcoming
                            </span>
                          </div>
                          <div className="space-y-1 text-slate-600 text-xs">
                            <div className="flex justify-between">
                              <span>Items:</span>
                              <span className="font-medium">{collection.items} designs</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Launch:</span>
                              <span className="font-medium">{collection.launch}</span>
                            </div>
                          </div>
                          <button className="w-full mt-3 bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition-colors duration-200 text-xs font-medium">
                            Pre-view
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Compact Fabric Detail Modal */}
      <AnimatePresence>
        {isFabricModalOpen && selectedFabric && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeFabricModal}
          >
            <motion.div
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold text-slate-800">{selectedFabric.name}</h3>
                  <button
                    onClick={closeFabricModal}
                    className="p-1 hover:bg-slate-100 rounded transition-colors duration-200"
                  >
                    <FiX size={18} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-100 rounded-md h-40 flex items-center justify-center">
                    <span className="text-4xl">🧵</span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1 text-sm">Description</h4>
                    <p className="text-slate-600 text-sm">{selectedFabric.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-1 text-sm">Composition</h4>
                      <p className="text-slate-600 text-sm">{selectedFabric.composition}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-1 text-sm">Width</h4>
                      <p className="text-slate-600 text-sm">{selectedFabric.width}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-1 text-sm">Weight</h4>
                      <p className="text-slate-600 text-sm">{selectedFabric.weight}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-1 text-sm">Stock</h4>
                      <p className="text-green-600 font-medium text-sm">{selectedFabric.stock}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-700 mb-1 text-sm">Care Instructions</h4>
                    <p className="text-slate-600 text-sm">{selectedFabric.care}</p>
                  </div>

                  <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">
                    Request Sample
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}