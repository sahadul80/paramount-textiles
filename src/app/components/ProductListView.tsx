import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from './types';

interface ProductListViewProps {
  groupedProducts: { [key: string]: Product[] };
  onProductClick: (product: Product) => void;
  onImageLoad: () => void;
}

const ProductListView: React.FC<ProductListViewProps> = ({
  groupedProducts,
  onProductClick,
  onImageLoad
}) => {
  return (
    <>
      {Object.entries(groupedProducts).map(([category, products], categoryIndex) => (
        <motion.section
          key={`${category}-${categoryIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: categoryIndex * 0.1, ease: "easeOut" }}
          className="m-1"
        >
          <div className="flex flex-row items-center min-h-[240px] max-h-[360px] bg-transparent rounded-lg shadow-md hover:shadow-lg transition-all">
            {/* Category Heading - Rotated 90 degrees */}
            <div className="w-10 sm:w-12 flex items-center justify-center bg-card-gradient rounded-l-lg">
              <h2 className="transform -rotate-90 whitespace-nowrap text-lg font-bold tracking-wide">
                {category}
              </h2>
            </div>

            {/* Products List - Horizontal Scroll */}
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex space-x-2 p-2 min-w-max rounded-lg">
                {products.map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={product}
                    index={index}
                    onProductClick={onProductClick}
                    onImageLoad={onImageLoad}
                    layout="list"
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.section>
      ))}
    </>
  );
};

export default ProductListView;