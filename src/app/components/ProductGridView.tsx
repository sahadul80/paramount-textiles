// components/CategoryProducts/ProductGridView.tsx
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product } from './types';

interface ProductGridViewProps {
  groupedProducts: { [key: string]: Product[] };
  onProductClick: (product: Product) => void;
  onImageLoad: () => void;
}

const ProductGridView: React.FC<ProductGridViewProps> = ({
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
          className="m-1 mb-3 mt-2"
        >
          <div className='flex flex-col'>
            <div className="flex items-center justify-between p-2">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-slate-800">{category}</h2>
              <span className="text-slate-500 font-medium text-xs sm:text-sm">{products.length} items</span>
            </div>

            <div className={`sm:gap-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5`}>
              {products.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`}
                  product={product}
                  index={index}
                  onProductClick={onProductClick}
                  onImageLoad={onImageLoad}
                  layout="grid"
                />
              ))}
            </div>
          </div>
        </motion.section>
      ))}
    </>
  );
};

export default ProductGridView;