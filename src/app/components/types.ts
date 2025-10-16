export interface Product {
  id: string;
  name: string;
  category: string;
  attributes: {
    [key: string]: string;
  };
  image: string;
}

export interface FilterState {
  category: string[];
  fabric: string[];
  size: string[];
  priceRange: string[];
}

export interface AvailableFilters {
  categories: string[];
  fabrics: string[];
  sizes: string[];
  priceRanges: string[];
}

export interface NavItem {
  label: string;
  href: string;
  submenu?: NavItem[];
}

export interface QualityMetric {
  icon: string;
  value: string;
  label: string;
}