/**
 * Sonic Electronics - Products Catalog Data
 */

const PRODUCTS = [
  {
    id: 'sonic-air-pro',
    name: 'Sonic Air Pro',
    category: 'Headphones',
    subCategory: 'SONIC · WIRELESS OVER-EAR',
    price: 129.00,
    rating: 4.8,
    reviewsCount: 248,
    image: 'assets/images/sonic-air-pro.jpg',
    images: {
      sand: 'assets/images/sonic-air-pro-sand.jpg',
      black: 'assets/images/sonic-air-pro-black.jpg',
      sage: 'assets/images/sonic-air-pro-sage.jpg'
    },
    colors: [
      { name: 'Sand', hex: '#D8C7B5', key: 'sand' },
      { name: 'Black', hex: '#2B2B2A', key: 'black' },
      { name: 'Sage', hex: '#8FA091', key: 'sage' }
    ],
    defaultColor: 'Sand',
    bestseller: true,
    inStock: true,
    battery: '40 h battery',
    connectivity: 'Wireless · Bluetooth 5.3',
    anc: 'Adaptive ANC',
    ancSupported: true,
    isWireless: true,
    specs: [
      { icon: 'battery', title: '40 hours', subtitle: 'Battery life' },
      { icon: 'anc', title: 'Adaptive ANC', subtitle: 'Noise control' },
      { icon: 'bluetooth', title: 'Bluetooth 5.3', subtitle: 'Connection' }
    ],
    tagline: 'Your world, on quiet.',
    description: 'Immerse yourself in rich, balanced sound. Adaptive noise cancellation creates a sanctuary of sound, while soft memory-foam cushions keep you comfortable, from your commute to your last call.',
    featured: true
  },
  {
    id: 'sonic-studio',
    name: 'Sonic Studio',
    category: 'Headphones',
    subCategory: 'SONIC · WIRELESS OVER-EAR',
    price: 159.00,
    rating: 4.9,
    reviewsCount: 186,
    image: 'assets/images/sonic-studio.jpg',
    images: {
      black: 'assets/images/sonic-studio.jpg',
      sand: 'assets/images/sonic-air-pro-sand.jpg'
    },
    colors: [
      { name: 'Black', hex: '#202020', key: 'black' },
      { name: 'Sand', hex: '#D8C7B5', key: 'sand' }
    ],
    defaultColor: 'Black',
    bestseller: false,
    inStock: true,
    battery: '50 h battery',
    connectivity: 'Wireless · Bluetooth 5.3',
    anc: 'Adaptive ANC',
    ancSupported: true,
    isWireless: true,
    specs: [
      { icon: 'battery', title: '50 hours', subtitle: 'Battery life' },
      { icon: 'anc', title: 'Adaptive ANC', subtitle: 'Noise control' },
      { icon: 'bluetooth', title: 'Bluetooth 5.3', subtitle: 'Connection' }
    ],
    tagline: 'Precision sound for perfectionists.',
    description: 'Studio-grade acoustics tuned for uncompromising clarity and depth. Engineered with custom 45mm neodymium drivers and ultra-low latency wireless streaming.',
    featured: false
  },
  {
    id: 'sonic-flow',
    name: 'Sonic Flow',
    category: 'Headphones',
    subCategory: 'SONIC · WIRELESS OVER-EAR',
    price: 99.00,
    rating: 4.6,
    reviewsCount: 124,
    image: 'assets/images/sonic-flow.jpg',
    images: {
      sage: 'assets/images/sonic-flow.jpg',
      sand: 'assets/images/sonic-air-pro-sand.jpg'
    },
    colors: [
      { name: 'Sage', hex: '#778873', key: 'sage' },
      { name: 'Sand', hex: '#D8C7B5', key: 'sand' }
    ],
    defaultColor: 'Sage',
    bestseller: false,
    inStock: true,
    battery: '35 h battery',
    connectivity: 'Wireless · Bluetooth 5.2',
    anc: 'Hybrid ANC',
    ancSupported: true,
    isWireless: true,
    specs: [
      { icon: 'battery', title: '35 hours', subtitle: 'Battery life' },
      { icon: 'anc', title: 'Hybrid ANC', subtitle: 'Noise control' },
      { icon: 'bluetooth', title: 'Bluetooth 5.2', subtitle: 'Connection' }
    ],
    tagline: 'Find your effortless rhythm.',
    description: 'Effortless listening engineered for your dynamic daily rhythm. Lightweight comfort, swift USB-C quick charge, and hybrid noise cancellation that adapts on the go.',
    featured: true
  },
  {
    id: 'sonic-lite',
    name: 'Sonic Lite',
    category: 'Headphones',
    subCategory: 'SONIC · WIRELESS OVER-EAR',
    price: 89.00,
    rating: 4.5,
    reviewsCount: 92,
    image: 'assets/images/sonic-lite.jpg',
    images: {
      white: 'assets/images/sonic-lite.jpg',
      black: 'assets/images/sonic-studio.jpg'
    },
    colors: [
      { name: 'Cream', hex: '#EBE6DC', key: 'white' },
      { name: 'Black', hex: '#2B2B2A', key: 'black' }
    ],
    defaultColor: 'Cream',
    bestseller: false,
    inStock: true,
    battery: '30 h battery',
    connectivity: 'Wireless · Bluetooth 5.2',
    anc: 'Passive isolation',
    ancSupported: false,
    isWireless: true,
    specs: [
      { icon: 'battery', title: '30 hours', subtitle: 'Battery life' },
      { icon: 'anc', title: 'Passive Isolation', subtitle: 'Ergonomic seal' },
      { icon: 'bluetooth', title: 'Bluetooth 5.2', subtitle: 'Connection' }
    ],
    tagline: 'Essential audio, featherlight ease.',
    description: 'Featherlight design packed with rich acoustic clarity. Clean minimal aesthetics, all-day battery endurance, and intuitive physical tactile controls.',
    featured: false
  },
  {
    id: 'sonic-travel-case',
    name: 'Sonic Travel Case',
    category: 'Accessories',
    subCategory: 'SONIC · ACCESSORIES',
    price: 24.00,
    rating: 4.9,
    reviewsCount: 310,
    image: 'assets/images/sonic-travel-case.jpg',
    images: {
      charcoal: 'assets/images/sonic-travel-case.jpg'
    },
    colors: [
      { name: 'Charcoal', hex: '#333333', key: 'charcoal' }
    ],
    defaultColor: 'Charcoal',
    bestseller: false,
    inStock: true,
    battery: 'N/A',
    connectivity: 'Protective Accessory',
    anc: 'Shockproof EVA',
    ancSupported: false,
    isWireless: false,
    specs: [
      { icon: 'case', title: 'Hard-shell EVA', subtitle: 'Impact protection' },
      { icon: 'water', title: 'Water-resistant', subtitle: 'Sealed zipper' },
      { icon: 'fit', title: 'Custom Fit', subtitle: 'Sonic series' }
    ],
    tagline: 'Armor for your sound.',
    description: 'Custom molded hard-shell travel case crafted to guard your Sonic headphones against drops, moisture, and scratches during transit. Includes internal cable mesh compartment.',
    featured: false
  }
];

// Categories definition
const CATEGORIES = [
  { id: 'laptops', name: 'Laptops', count: 12, icon: 'laptop' },
  { id: 'headphones', name: 'Headphones', count: 24, icon: 'headphones', active: true },
  { id: 'led-tv', name: 'LED TV', count: 8, icon: 'tv' },
  { id: 'phones', name: 'Phones', count: 18, icon: 'phone' },
  { id: 'bluetooth-buds', name: 'Bluetooth Buds', count: 15, icon: 'buds' }
];

if (typeof window !== 'undefined') {
  window.SONIC_PRODUCTS = PRODUCTS;
  window.SONIC_CATEGORIES = CATEGORIES;
}
