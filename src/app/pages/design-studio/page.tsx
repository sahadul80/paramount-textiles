'use client';

import { useState, Dispatch, SetStateAction, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import ParamountLoader from '../../components/Loader';

// Lazy loaded components
const CategoryProducts = lazy(() => import("../../components/CategoryProducts"));
const StudioVideoBanner = lazy(() => import('../../components/StudioVideoBanner'));
const StudioBanner = lazy(() => import('../../components/StudioBanner'));

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
        <div className="flex flex-wrap gap-1 glass rounded-lg border border-border/20 perspective-1000">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActive(tab.id)}
                    className={`relative flex-1 p-1 text-sm font-medium rounded-lg flex items-center justify-center gap-1 transition-all duration-300 hover-lift focus-ring ${
                        active === tab.id
                            ? 'text-orange-700 bg-orange-200 shadow-sm' 
                            : 'text-base hover:text-primary hover:bg-background'
                    }`}
                >
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {active === tab.id && (
                        <span className="absolute bottom-1 left-1/4 w-1/2 h-1 bg-primary rounded-lg shadow-lg"></span>
                    )}
                </button>
            ))}
        </div>
    );

    return (
      <div className="container mx-auto max-h-screen overflow-hidden">
        <div className="bg-gradient-modern perspective-1000">
            <div className="container">
                <Suspense fallback={<div className="animate-shimmer rounded-lg h-16 sm:h-20 bg-muted" />}>
                    <StudioBanner heightClass="h-16 sm:h-20" patternCycleMs={3000} showControls={false} />
                </Suspense>
            </div>

            {/* Main Tabs */}
            <div className="sticky top-0 z-50 p-1">
                <div className="container flex justify-between glass-intense gap-1">
                    {mainTabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`p-1 w-full flex-1 items-center justify-center gap-2 text-md font-bold rounded-lg transition-all duration-300 hover-lift focus-ring ${
                                activeTab === tab.id
                                    ? 'text-orange-700 bg-orange-200 shadow-sm' 
                                    : 'text-base hover:text-primary hover:bg-background'
                            }`}
                        >
                            <span className="text-lg">{tab.icon}</span>
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
                            <Suspense fallback={<ParamountLoader />}>
                                <StudioVideoBanner
                                    heightClass="h-[85vh]"
                                    overlayClass="none"
                                />
                            </Suspense>
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
                            className="space-y-6"
                        >
                            {renderSubTabs(fabricSubTabs, fabricSubTab, setFabricSubTab)}
                            <div className="glass flex justify-center overflow-auto rounded-lg p-6">
                                {fabricSubTab === 'stock' && (
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        {fabricData.map(fabric => (
                                            <motion.div
                                                key={fabric.id}
                                                className="bg-card rounded-lg shadow-lg border border-border/50 overflow-hidden hover-lift cursor-pointer group"
                                                whileHover={{ y: -4 }}
                                                onClick={() => handleFabricClick(fabric)}
                                            >
                                                <div className="h-48 bg-gradient-subtle flex items-center justify-center group-hover:bg-accent/50 transition-colors duration-300">
                                                    <span className="text-6xl">🧵</span>
                                                </div>
                                                <div className="p-4">
                                                    <h4 className="font-bold text-card-foreground text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                                                        {fabric.name}
                                                    </h4>
                                                    <div className="flex justify-between text-sm text-muted-foreground">
                                                        <span>Pattern:</span>
                                                        <span className="font-medium">{fabric.pattern}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-muted-foreground mt-1">
                                                        <span>Stock:</span>
                                                        <span className="font-semibold text-green-600">{fabric.stock}</span>
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
                            className="space-y-1"
                        >
                            {renderSubTabs(rmgSubTabs, rmgSubTab, setRmgSubTab)}
                            <div className="glass rounded-lg overflow-hidden scrollbar-hide">
                                {rmgSubTab === 'current' && (
                                    <Suspense fallback={<ParamountLoader />}>
                                        <CategoryProducts />
                                    </Suspense>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Fabric Modal */}
            <AnimatePresence>
                {isFabricModalOpen && selectedFabric && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeFabricModal}
                    >
                        <motion.div
                            className="bg-card rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto modal-content border border-border/50"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-2 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-bold text-card-foreground">{selectedFabric.name}</h3>
                                        <p className="text-muted-foreground mt-1">{selectedFabric.pattern}</p>
                                    </div>
                                    <button 
                                        onClick={closeFabricModal} 
                                        className="p-2 hover:bg-muted rounded-lg transition-colors duration-200 focus-ring"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                                
                                <div className="bg-gradient-subtle rounded-lg h-64 flex items-center justify-center">
                                    <span className="text-8xl">🧵</span>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-card-foreground text-lg mb-2">Description</h4>
                                    <p className="text-muted-foreground leading-relaxed">{selectedFabric.description}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-card-foreground mb-1">Composition</h4>
                                            <p className="text-muted-foreground">{selectedFabric.composition}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-card-foreground mb-1">Width</h4>
                                            <p className="text-muted-foreground">{selectedFabric.width}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="font-semibold text-card-foreground mb-1">Weight</h4>
                                            <p className="text-muted-foreground">{selectedFabric.weight}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-card-foreground mb-1">Stock</h4>
                                            <p className="text-green-600 font-semibold text-lg">{selectedFabric.stock}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div>
                                    <h4 className="font-semibold text-card-foreground text-lg mb-2">Care Instructions</h4>
                                    <p className="text-muted-foreground">{selectedFabric.care}</p>
                                </div>
                                
                                <button className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold text-lg hover:bg-primary/90 transition-colors duration-200 focus-ring shadow-lg shadow-primary/25">
                                    Request Sample
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
        
    );
}