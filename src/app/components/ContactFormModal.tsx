// components/CategoryProducts/ContactFormModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageCircle, FiSend } from 'react-icons/fi';
import Image from 'next/image';
import type { Product } from './types';

interface ContactFormModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ContactFormModal: React.FC<ContactFormModalProps> = ({ 
  product, 
  isOpen, 
  onClose 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    message: `I'm interested in ${product.name}. Please provide quotation.`
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', { ...formData, product });
      // Handle form submission here
      alert('Quotation request submitted!');
      onClose();
    }
  };

  const handleWhatsApp = () => {
    const message = `Hello! I'm interested in ${product.name}. Here are my details:
      Name: ${formData.name}
      Phone: ${formData.phone}
      Email: ${formData.email}
      ${formData.address ? `Address: ${formData.address}` : ''}
      Message: ${formData.message}`;

      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-backdrop backdrop-blur-lg z-[200]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={onClose}
          />
          
          {/* Modal Content */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              className="bg-white w-full max-w-2xl max-h-[75vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-2 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800 ml-4">Get Quote</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-all duration-300 text-slate-600 hover:text-slate-800"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4">
                {/* Product Summary */}
                <div className="bg-slate-50 rounded-lg p-2">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-800 truncate">{product.name}</h3>
                      <p className="text-sm text-slate-600">{product.category}</p>
                      <p className="text-sm text-slate-600 truncate">{product.attributes.Fabric}</p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                          errors.name ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Your full name"
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                          errors.phone ? 'border-red-500' : 'border-slate-300'
                        }`}
                        placeholder="Your phone number"
                      />
                      {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors.email ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Your email address"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Address (Optional)
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      rows={2}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Your address for delivery"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={3}
                      className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors.message ? 'border-red-500' : 'border-slate-300'
                      }`}
                      placeholder="Additional requirements or questions"
                    />
                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  </div>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="p-2 border-t border-slate-200 bg-slate-50">
                <div className="flex flex-row justify-between gap-2">
                  <button
                    onClick={handleWhatsApp}
                    className="w-1/2 bg-green-500 text-white p-2 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FiMessageCircle size={18} />
                    WhatsApp
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="w-1/2 bg-primary p-2 rounded-lg font-semibold hover:bg-primary-hover transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <FiSend size={18} />
                    Submit Quote
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactFormModal;