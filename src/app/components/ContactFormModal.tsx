// components/CategoryProducts/ContactFormModal.tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMessageCircle, FiSend } from 'react-icons/fi';
import Image from 'next/image';
import type { Product } from './types';
import TextileBanner from './TextileBanner';

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
        <div className='w-full h-full'>
            {/* Backdrop */}
            <motion.div
                className="fixed inset-0 bg-primary/50 backdrop-blur-3xl z-[200] rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                onClick={onClose}
            />
          
            {/* Modal Content */}
            <div className="fixed inset-0 h-[80vh] z-[201] flex items-center justify-center p-2 sm:p-4 backdrop-blur-3xl">
                <motion.div
                    className="bg-foreground w-full h-full flex flex-col overflow-auto shadow-2xl rounded-lg border-1"
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-2 border-b border-slate-200 flex-shrink-0 shadow-lg">
                        <h2 className="text-2xl font-bold truncate text-base text-center">Get Quote</h2>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-lg transition-all duration-300 text-base shadow-lg border-1 hover:text-primary hover:bg-secondary hover:scale-110"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {/* Content */}
                        <div className="bg-foreground w-full h-full flex flex-row overflow-auto shadow-2xl gap-2">
                            <div className="w-1/3 flex flex-col items-center justify-center bg-primary backdrop-blur-3xl">
                                <h1 className='font-bold'>Selected Item</h1>
                                <div className="relative w-48 h-96 m-4 rounded-lg overflow-hidden">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        objectFit="contain"
                                    />
                                </div>
                                <div className="flex flex-col p-2">
                                    <h2 className="font-semibold text-base text-xl truncate">{product.name}</h2>
                                    <p className="text-sm text-base">{product.category}</p>
                                    <p className="text-sm text-base truncate">{product.attributes.Fabric}</p>
                                </div>
                            </div>
                            {/* Contact Form */}
                            <form onSubmit={handleSubmit} className="w-2/3 h-full bg-secondary backdrop-blur-3xl flex flex-col justify-between border-1 rounded-lg p-2">
                                <h1 className='flex justify-center font-bold'>PROVIDE YOUR QUOTEATION</h1>
                                <div className="grid grid-rows-1 sm:grid-rows-2 gap-2">
                                    <div>
                                    <label className="block text-sm font-medium text-base mb-1">
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
                                    <label className="block text-sm font-medium text-base mb-1">
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
                                    <label className="block text-sm font-medium text-base mb-1">
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
                                    <label className="block text-sm font-medium text-base mb-1">
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
                                    <label className="block text-sm font-medium text-base mb-1">
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
                    <div className="p-2 border-t border-t bg-foreground">
                        <div className="flex flex-row justify-between gap-2">
                        <button
                            onClick={handleWhatsApp}
                            className="w-1/2 bg-gradient-to-r from-green-400 to-emerald-500 text-base p-2 rounded-lg font-bold hover:from-emerald-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 hover:scale-102"
                        >
                            <FiMessageCircle size={18} />
                            WhatsApp
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="w-1/2 bg-gradient-to-r from-sky-400 to-indigo-500 text-base p-2 rounded-lg font-bold hover:from-indigo-500 hover:to-sky-600 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 hover:scale-102"
                        >
                            <FiSend size={18} />
                            Submit Quote
                        </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
        )}
        </AnimatePresence>
    );
};

export default ContactFormModal;