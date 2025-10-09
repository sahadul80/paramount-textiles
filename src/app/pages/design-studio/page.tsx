'use client';

import { useState, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import CategoryProducts from "../../components/CategoryProducts";
import StudioVideoBanner from '../../components/StudioVideoBanner';
import StudioBanner from '../../components/StudioBanner';

// TypeScript interfaces
interface Fabric {
  id: number;
  name: string;
  pattern: string;
  weight: string;
  color: string;
  stock: string;
  image: string;
  description: string;
  composition: string;
  width: string;
  care: string;
}

interface Collection {
  id: number;
  name: string;
  items: number;
  launch: string;
}

interface SeasonalData {
  current: Collection[];
  seasonal: Collection[];
  upcoming: Collection[];
}

// Tabs
type MainTab = 'studio' | 'fabric' | 'rmg';
type StudioSubTab = 'portfolio' | 'banner' | 'design-tools';
type FabricSubTab = 'patterns' | 'weaving' | 'stock';
type RmgSubTab = 'current' | 'seasonal' | 'upcoming';

interface Tab<T extends string> {
  id: T;
  label: string;
  icon: string;
}

// Mock data
const fabricData: Fabric[] = [
  { id: 1, name: "Cotton Twill", pattern: "Diagonal Weave", weight: "Medium", color: "Natural", stock: "1500m", image: "/fabrics/cotton-twill.jpg", description: "Soft and durable cotton twill fabric.", composition: "100% Cotton", width: "58 inches", care: "Machine wash cold" },
  { id: 2, name: "Silk Chiffon", pattern: "Plain Weave", weight: "Light", color: "Ivory", stock: "800m", image: "/fabrics/silk-chiffon.jpg", description: "Luxurious silk chiffon.", composition: "100% Silk", width: "45 inches", care: "Dry clean only" },
  { id: 3, name: "Denim Stretch", pattern: "Twill", weight: "Heavy", color: "Indigo", stock: "2000m", image: "/fabrics/denim-stretch.jpg", description: "Comfortable stretch denim.", composition: "98% Cotton, 2% Spandex", width: "60 inches", care: "Machine wash cold" },
  { id: 4, name: "Linen Blend", pattern: "Plain Weave", weight: "Medium", color: "Ecru", stock: "1200m", image: "/fabrics/linen-blend.jpg", description: "Breathable linen blend.", composition: "70% Linen, 30% Cotton", width: "55 inches", care: "Machine wash warm" }
];

const seasonalData: SeasonalData = {
  current: [{ id: 1, name: "Spring Collection 2024", items: 45, launch: "Active" }, { id: 2, name: "Workwear Essentials", items: 32, launch: "Active" }],
  seasonal: [{ id: 1, name: "Summer Vibes 2024", items: 28, launch: "June 2024" }, { id: 2, name: "Resort Collection", items: 15, launch: "May 2024" }],
  upcoming: [{ id: 1, name: "Fall Winter 2024", items: 0, launch: "August 2024" }, { id: 2, name: "Holiday Collection", items: 0, launch: "October 2024" }]
};

// Tabs arrays
const mainTabs: Tab<MainTab>[] = [
  { id: 'studio', label: 'Studio', icon: '🎨' },
  { id: 'fabric', label: 'Fabric', icon: '🧵' },
  { id: 'rmg', label: 'RMG', icon: '👕' }
];
const fabricSubTabs: Tab<FabricSubTab>[] = [
  { id: 'patterns', label: 'Patterns', icon: '🔸' },
  { id: 'weaving', label: 'Weaving', icon: '🏭' },
  { id: 'stock', label: 'Stock', icon: '📦' }
];
const rmgSubTabs: Tab<RmgSubTab>[] = [
  { id: 'current', label: 'Current', icon: '🔄' },
  { id: 'seasonal', label: 'Seasonal', icon: '🌞' },
  { id: 'upcoming', label: 'Upcoming', icon: '🚀' }
];

export default function DesignStudio() {
  const [activeTab, setActiveTab] = useState<MainTab>('studio');
  const [fabricSubTab, setFabricSubTab] = useState<FabricSubTab>('stock');
  const [rmgSubTab, setRmgSubTab] = useState<RmgSubTab>('current');
  const [selectedFabric, setSelectedFabric] = useState<Fabric | null>(null);
  const [isFabricModalOpen, setIsFabricModalOpen] = useState(false);

  const handleFabricClick = (fabric: Fabric) => {
    setSelectedFabric(fabric);
    setIsFabricModalOpen(true);
  };
  const closeFabricModal = () => {
    setIsFabricModalOpen(false);
    setSelectedFabric(null);
  };

  const renderSubTabs = <T extends string>(
    tabs: Tab<T>[], 
    active: T, 
    setActive: Dispatch<SetStateAction<T>>
  ) => (
    <div className="flex flex-wrap gap-2 bg-white/70 backdrop-blur-md rounded-md p-1 border border-slate-200 relative perspective-1000">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActive(tab.id)}
          className={`relative flex-1 py-2 px-2 text-xs font-medium rounded-md flex items-center justify-center gap-1 transition-all duration-300 transform hover:-translate-y-0.5 ${
            active === tab.id
              ? 'text-blue-600 font-semibold z-10'
              : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <span className="text-sm">{tab.icon}</span>
          <span className="text-sm">{tab.label}</span>
          {active === tab.id && (
            <span className="absolute -bottom-1 left-1/4 w-1/2 h-[3px] bg-blue-500 rounded-full shadow-md"></span>
          )}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 perspective-1000">
      <div className="container">
        <StudioBanner heightClass="h-20" patternCycleMs={3500} showControls={false} />
      </div>

      {/* Main Tabs */}
      <div className="border-b border-slate-200 sticky top-0 z-50">
        <div className="container flex justify-between flex gap-2 flex-wrap">
          {mainTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`p-2 w-full flex-1 items-center justify-center gap-1 text-sm font-semibold transition-all duration-300 transform hover:-translate-y-0.5 ${
                activeTab === tab.id
                  ? 'text-blue-600 bg-blue-50 shadow-md'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-base">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub Tabs + Content */}
      <div className="container">
        {/* Studio */}
        <AnimatePresence mode="wait">
          {activeTab === 'studio' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <StudioVideoBanner
                videoSrc="/videos/design-studio.mp4"
                poster="/images/video-poster.jpg"
                overlayText="Design Studio"
                heightClass="h-auto"
                overlayClass=""
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fabric */}
        <AnimatePresence mode="wait">
          {activeTab === 'fabric' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSubTabs(fabricSubTabs, fabricSubTab, setFabricSubTab)}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 p-2">
                {fabricSubTab === 'stock' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {fabricData.map(fabric => (
                      <motion.div
                        key={fabric.id}
                        className="bg-white rounded-md shadow-xs border border-slate-200 overflow-hidden hover:shadow-sm cursor-pointer"
                        whileHover={{ y: -2 }}
                        onClick={() => handleFabricClick(fabric)}
                      >
                        <div className="h-32 bg-slate-200 flex items-center justify-center">🧵</div>
                        <div className="p-3">
                          <h4 className="font-bold text-slate-800 text-sm mb-1">{fabric.name}</h4>
                          <div className="flex justify-between text-xs text-slate-600">
                            <span>Pattern:</span><span>{fabric.pattern}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RMG */}
        <AnimatePresence mode="wait">
          {activeTab === 'rmg' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderSubTabs(rmgSubTabs, rmgSubTab, setRmgSubTab)}
              <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-slate-200 p-2">
                {rmgSubTab === 'current' && <CategoryProducts />}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fabric Modal */}
      <AnimatePresence>
        {isFabricModalOpen && selectedFabric && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-2"
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
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-slate-800">{selectedFabric.name}</h3>
                  <button onClick={closeFabricModal} className="p-1 hover:bg-slate-100 rounded transition-colors duration-200">
                    <FiX size={18} />
                  </button>
                </div>
                <div className="bg-slate-100 rounded-md h-40 flex items-center justify-center">🧵</div>
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
                <button className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm font-medium">Request Sample</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}