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
          className="m-0"
        >
          <div className='flex flex-col justify-center rounded-lg overflow-hidden'>
            <div className="flex items-center justify-between p-2 mx-10">
              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-primary">{category}</h2>
              <span className="text-secondary font-medium text-xs sm:text-sm">{products.length} items</span>
            </div>

            <div className={`gap-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 p-2`}>
              {products.map((product, index) => (
                <div className='flex justify-center' key={`${product.id}-${index}`}>
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={product}
                    index={index}
                    onProductClick={onProductClick}
                    onImageLoad={onImageLoad}
                    layout="grid"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      ))}
    </>
  );
};

export default ProductGridView;