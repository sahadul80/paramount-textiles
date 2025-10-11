// components/CategoryProducts/ProductCard.tsx
import { motion } from 'framer-motion';
import LazyImage from './LazyImage';
import type { Product } from './types';

interface ProductCardProps {
  product: Product;
  index: number;
  onProductClick: (product: Product) => void;
  onImageLoad: () => void;
  layout: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onProductClick,
  onImageLoad,
  layout
}) => {
  const cardClasses = {
    grid: "bg-transparent rounded-lg shadow-sm hover:shadow-2xl transition-all ease-in-out cursor-pointer group overflow-hidden flex flex-col h-72 w-48",
    list: "flex-shrink-0 w-84 rounded-lg shadow-xs hover:shadow-lg transition-all duration-500 ease-in-out cursor-pointer group overflow-hidden flex flex-row h-48 p-2"
  };

  const imageContainerClasses = {
    grid: "relative overflow-hidden h-96 w-48 flex-grow-full",
    list: "h-72 w-36 relative overflow-hidden"
  };

  const contentClasses = {
    grid: "p-2 flex flex-col justify-center",
    list: "p-1 gap-2 flex flex-col justify-center"
  };

  return (
    <motion.div
      className={`${cardClasses[layout]} ${layout === 'list' ? 'flex items-center min-h-[220] justify-between' : ''} border-1`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ 
        y: layout === 'grid' ? -4 : -4, 
        scale: layout === 'grid' ? 1.02 : 1.03,
        transition: { duration: layout === 'grid' ? 0.2 : 0.3, ease: "easeOut" }
      }}
      onClick={() => onProductClick(product)}
    >
      <div className={imageContainerClasses[layout]}>
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-48 h-96"
          onLoad={onImageLoad}
        />
      </div>
      
      <div className={contentClasses[layout]}>
        <h3 className={`text-sm text-base font-semibold mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1 ${layout === 'list' ? 'flex text-wrap' : ''}`}>
          {product.name}
        </h3>
        <div className={`flex items-center justify-between ${layout === 'list' ? 'flex-col items-end' : ''}`}>
          <span className="text-base text-xs lg:text-sm capitalize line-clamp-1">
            {product.attributes.Fabric}
          </span>
          {layout === 'list' && (
          <div className="w-full flex flex-col items-end justify-between">
            <span className="text-base text-xs lg:text-sm capitalize line-clamp-1">
                {product.attributes.Fit}
            </span>
                <span className="text-base text-xs lg:text-sm capitalize line-clamp-1">
                {product.attributes.Brand}
            </span>
                <span className="text-base text-xs lg:text-sm capitalize line-clamp-1">
                {product.attributes.Care}
            </span>
                <span className="text-base text-xs lg:text-sm capitalize line-clamp-1">
                {product.attributes.Collection}
            </span>
          </div>
        )}
          {layout === 'grid' ? (
            <span className="text-primary text-xs font-medium bg-secondary px-1.5 py-0.5 rounded-full border-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              View
            </span>
          ) : (
            <div className="mt-4 w-auto flex justify-end p-1 rounded-full text-xs border border-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                View
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;