import { Product } from "@/types";

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "midnight-velvet",
    name: "Midnight Velvet",
    brand: "Debby's Signature",
    tagline: "Seduction in the Dark",
    description: "An intoxicating blend of rich black amber, spiced dark vanilla, and smoldering oud wood. Midnight Velvet embraces the mysterious allure of the night with a deep, long-lasting trailing aroma.",
    category: "men",
    fragranceFamily: "oriental",
    topNotes: ["Black Cardamom", "Bergamot", "Pink Pepper"],
    heartNotes: ["Midnight Jasmine", "Smoked Plum", "Orris Root"],
    baseNotes: ["Dark Amber", "Oud Wood", "Madagascar Vanilla"],
    sizes: [
      { size: "5ml", price: 6000 },
      { size: "10ml", price: 12000 },
      { size: "25ml", price: 30000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewCount: 148,
    isBestSeller: true,
    isFeatured: true,
    stock: 25
  },
  {
    id: "bloom-noir",
    name: "Bloom Noir",
    brand: "Debby's Private Collection",
    tagline: "Wild Elegance Redefined",
    description: "A sensual dark floral creation featuring velvet black rose petals intertwined with midnight patchouli and crushed saffron. Designed for the woman who commands every room she enters.",
    category: "women",
    fragranceFamily: "floral",
    topNotes: ["Damask Rose", "Crushed Saffron", "Mandarin Zest"],
    heartNotes: ["Black Orchid", "Night-Blooming Jasmine", "Peony"],
    baseNotes: ["Indonesian Patchouli", "Warm Amber", "Sensual Musk"],
    sizes: [
      { size: "5ml", price: 7000 },
      { size: "10ml", price: 13500 },
      { size: "25ml", price: 34000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewCount: 215,
    isBestSeller: true,
    isNewArrival: false,
    isFeatured: true,
    stock: 18
  },
  {
    id: "citrus-solstice",
    name: "Citrus Solstice",
    brand: "Debby's Fresh",
    tagline: "Sunlight Captured in a Bottle",
    description: "An invigorating burst of sun-drenched Italian bergamot, crisp grapefruit, and coastal sea salt. A luminous unisex scent that evokes Mediterranean summer afternoons.",
    category: "unisex",
    fragranceFamily: "citrus",
    topNotes: ["Calabrian Bergamot", "Ruby Grapefruit", "Lime Leaf"],
    heartNotes: ["Neroli", "Sea Salt Accord", "Green Tea"],
    baseNotes: ["White Vetiver", "Clean Cedarwood", "Ambergris"],
    sizes: [
      { size: "5ml", price: 5000 },
      { size: "10ml", price: 9500 },
      { size: "25ml", price: 24000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.7,
    reviewCount: 92,
    isNewArrival: true,
    isFeatured: true,
    stock: 40
  },
  {
    id: "amber-royale",
    name: "Amber Royale",
    brand: "Elixir Prestige",
    tagline: "Opulence Fit for Royalty",
    description: "Rich, opulent golden amber mingled with rare honeyed tobacco leaves and warm cinnamon bark. Highly concentrated for unmatched sillage and royal presence.",
    category: "unisex",
    fragranceFamily: "oriental",
    topNotes: ["Honey Accord", "Cinnamon Bark", "Nutmeg"],
    heartNotes: ["Golden Amber", "Labdanum", "Myrrh"],
    baseNotes: ["Blonde Tobacco", "Sandalwood", "Tonka Bean"],
    sizes: [
      { size: "5ml", price: 8000 },
      { size: "10ml", price: 16000 },
      { size: "25ml", price: 40000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 5.0,
    reviewCount: 310,
    isBestSeller: true,
    isFeatured: true,
    stock: 12
  },
  {
    id: "jasmine-dusk",
    name: "Jasmine Dusk",
    brand: "Debby's Signature",
    tagline: "Enchantment at Twilight",
    description: "Graceful night- blooming jasmine balanced by soft white peach nectar and creamy sandalwood. Elegant, ethereal, and delicately intoxicating.",
    category: "women",
    fragranceFamily: "floral",
    topNotes: ["White Peach", "Green Mandarin", "Star Anise"],
    heartNotes: ["Royal Jasmine Sambac", "Orange Blossom", "Gardenia"],
    baseNotes: ["Australian Sandalwood", "Cashmere Musk", "Vanilla Orchid"],
    sizes: [
      { size: "5ml", price: 5500 },
      { size: "10ml", price: 11000 },
      { size: "25ml", price: 27500 }
    ],
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewCount: 178,
    isNewArrival: true,
    isFeatured: false,
    stock: 30
  },
  {
    id: "sandalwood-dreams",
    name: "Sandalwood Dreams",
    brand: "Niche Reserve",
    tagline: "Meditative Luxury",
    description: "Creamy Mysore sandalwood bathed in warm cardamon spices and earthy iris. A grounding, velvety scent that lingers close to the skin with comforting luxury.",
    category: "unisex",
    fragranceFamily: "woody",
    topNotes: ["Guatemalan Cardamom", "Violet Leaf", "Papyrus"],
    heartNotes: ["Florentine Iris", "Cedarwood", "Cypress"],
    baseNotes: ["Mysore Sandalwood", "White Amber", "Leather Accord"],
    sizes: [
      { size: "5ml", price: 6500 },
      { size: "10ml", price: 13000 },
      { size: "25ml", price: 32500 }
    ],
    images: [
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewCount: 88,
    isBestSeller: false,
    isNewArrival: true,
    isFeatured: false,
    stock: 22
  },
  {
    id: "rose-elixir",
    name: "Rose Élixir",
    brand: "Debby's Private Collection",
    tagline: "The Nectar of Royalty",
    description: "Turkish rose absolute steeped in black cherry liqueur and dark patchouli. A luxurious nectar created for lovers of deep, opulent floral fragrances.",
    category: "women",
    fragranceFamily: "floral",
    topNotes: ["Black Cherry", "Bergamot", "Pink Pepper"],
    heartNotes: ["Turkish Rose Absolute", "Centifolia Rose", "Geranium"],
    baseNotes: ["Patchouli Heart", "Vanilla Absolute", "Tonka Bean"],
    sizes: [
      { size: "5ml", price: 7500 },
      { size: "10ml", price: 14500 },
      { size: "25ml", price: 36000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewCount: 164,
    isBestSeller: true,
    isFeatured: true,
    stock: 15
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    brand: "Debby's Fresh",
    tagline: "The Power of the Open Sea",
    description: "Crisp marine air infused with crushed mint leaves, driftwood, and salty ocean spray. Energetic, masculine, and clean like a fresh sea gust.",
    category: "men",
    fragranceFamily: "fresh",
    topNotes: ["Marine Accord", "Crushed Mint", "Green Apple"],
    heartNotes: ["Lavender", "Sage", "Juniper Berry"],
    baseNotes: ["Sun-Bleached Driftwood", "Oakmoss", "Ambroxan"],
    sizes: [
      { size: "5ml", price: 4500 },
      { size: "10ml", price: 9000 },
      { size: "25ml", price: 22500 }
    ],
    images: [
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.6,
    reviewCount: 120,
    isBestSeller: false,
    isNewArrival: false,
    isFeatured: false,
    stock: 35
  },
  {
    id: "vanilla-seduction",
    name: "Vanilla Seduction",
    brand: "Debby's Signature",
    tagline: "Warm, Decadent, Unforgettable",
    description: "Bourbon vanilla bean laced with salted caramel, warm almond, and spun sugar. A mouthwatering gourmand perfume that wraps you in cozy luxury.",
    category: "women",
    fragranceFamily: "gourmand",
    topNotes: ["Salted Caramel", "Bitter Almond", "Coconut Water"],
    heartNotes: ["Bourbon Vanilla", "Heliotrope", "Cocoa Butter"],
    baseNotes: ["Sandalwood", "Benzoin", "White Musk"],
    sizes: [
      { size: "5ml", price: 5500 },
      { size: "10ml", price: 10500 },
      { size: "25ml", price: 26000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.9,
    reviewCount: 280,
    isBestSeller: true,
    isFeatured: true,
    stock: 28
  },
  {
    id: "leather-smoke",
    name: "Leather & Smoke",
    brand: "Elixir Prestige",
    tagline: "Bold, Sophisticated, Command",
    description: "Fine Italian leather infused with charred birch wood, smoldering incense, and dark vetiver. Crafted for discerning gentlemen who appreciate timeless authority.",
    category: "men",
    fragranceFamily: "woody",
    topNotes: ["Smoked Incense", "Black Pepper", "Bergamot"],
    heartNotes: ["Italian Leather", "Birch Tar", "Clove Blossom"],
    baseNotes: ["Haitian Vetiver", "Cade Oil", "Amberwood"],
    sizes: [
      { size: "5ml", price: 7000 },
      { size: "10ml", price: 14000 },
      { size: "25ml", price: 35000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.8,
    reviewCount: 105,
    isNewArrival: true,
    isFeatured: false,
    stock: 19
  },
  {
    id: "velvet-iris",
    name: "Velvet Iris",
    brand: "Debby's Private Collection",
    tagline: "Powdery Elegance",
    description: "Rare Florentine iris butter blended with violet leaf and soft suede. An ultra-refined powder scent for connoisseurs.",
    category: "unisex",
    fragranceFamily: "floral",
    topNotes: ["Violet Leaf", "Italian Lemon"],
    heartNotes: ["Florentine Iris", "Mimosa", "Rose"],
    baseNotes: ["White Suede", "Cedarwood", "Musk"],
    sizes: [
      { size: "5ml", price: 6500 },
      { size: "10ml", price: 12800 },
      { size: "25ml", price: 32000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 4.7,
    reviewCount: 65,
    stock: 14
  },
  {
    id: "royal-oud",
    name: "Royal Oud Imperial",
    brand: "Elixir Prestige",
    tagline: "Liquid Gold of Arabia",
    description: "Aged Cambodian oud combined with Taif rose and liquid frankincense. The ultimate expression of luxury perfume craftsmanship.",
    category: "unisex",
    fragranceFamily: "oriental",
    topNotes: ["Taif Rose", "Saffron Threads"],
    heartNotes: ["Cambodian Oud", "Frankincense"],
    baseNotes: ["Civet Accord", "Golden Amber", "Sandalwood"],
    sizes: [
      { size: "5ml", price: 10000 },
      { size: "10ml", price: 19500 },
      { size: "25ml", price: 49000 }
    ],
    images: [
      "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&q=80&w=800"
    ],
    rating: 5.0,
    reviewCount: 420,
    isBestSeller: true,
    isFeatured: true,
    stock: 8
  }
];
