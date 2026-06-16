'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShoppingBag, CheckCircle, Clock, Truck, ShieldAlert, BadgePercent,
  Sparkles, IndianRupee, MapPin, Eye, UploadCloud, Check, HelpCircle,
  Plus, Trash2, ArrowRight, Star, AlertCircle, AlertTriangle, RefreshCw
} from 'lucide-react';

interface DesignerBoutique {
  id: string;
  brandName: string;
  designer: string;
  city: string;
  gstin: string;
  isVerified: boolean;
  rating: number;
  revenue: number;
  activeOrders: number;
}

interface DressProduct {
  id: string;
  boutiqueId: string;
  boutiqueName: string;
  title: string;
  category: string;
  price: number;
  fabric: string;
  embroidery: string;
  colors: string[];
  sizes: string[];
  img: string;
  isModerated: boolean;
  reviewsCount: number;
  rating: number;
}

interface CartItem {
  product: DressProduct;
  selectedSize: string;
  qty: number;
}

interface SimulatedOrder {
  id: string;
  customerName: string;
  items: CartItem[];
  itemTotal: number;
  tax: number;
  grandTotal: number;
  commissionCollected: number;
  designerSettlement: number;
  paymentStatus: 'pending' | 'captured';
  shippingStatus: 'order_placed' | 'picked_up' | 'in_transit' | 'delivered';
  timelineDates: { placed: string; picked: string; transit: string; delivery: string };
}

// Global Seeds & Pure Utilities defined entirely OUTSIDE the react rendering tree for safety
const BASE_BOUTIQUES: DesignerBoutique[] = [
  { id: 'bt-var-01', brandName: 'Rajendra Silk Guild', designer: 'Rajendra Pal', city: 'Varanasi', gstin: '09AAAPR7725M1ZS', isVerified: true, rating: 5.0, revenue: 125000, activeOrders: 0 },
  { id: 'bt-luc-01', brandName: 'Kashish Chikankari', designer: 'Kashish Sharma', city: 'Lucknow', gstin: '09AAAPR5126H1ZS', isVerified: true, rating: 4.9, revenue: 78000, activeOrders: 0 },
  { id: 'bt-jai-01', brandName: 'Jaipur Heritage Atelier', designer: 'Meera Agrawal', city: 'Jaipur', gstin: '08AAAPR3211C1ZS', isVerified: true, rating: 4.8, revenue: 92000, activeOrders: 0 },
  { id: 'bt-mum-01', brandName: 'Anahita Patel Couturier', designer: 'Anahita Patel', city: 'Mumbai', gstin: '27AAAPR9901R1ZS', isVerified: false, rating: 4.6, revenue: 0, activeOrders: 0 }
];

const BASE_PRODUCTS: DressProduct[] = [
  {
    id: 'pr-01',
    boutiqueId: 'bt-var-01',
    boutiqueName: 'Rajendra Silk Guild',
    title: 'Imperial Maroon Zardozi Banarasi Lehenga',
    category: 'Lehenga',
    price: 48500,
    fabric: 'Handloom Katan Silk',
    embroidery: 'Complex Pure Gold Wire Zardozi Embroidery',
    colors: ['Crimson Red', 'Antique Gold'],
    sizes: ['S', 'M', 'L'],
    img: 'https://picsum.photos/seed/maroonlehenga/600/800',
    isModerated: true,
    reviewsCount: 14,
    rating: 4.9
  },
  {
    id: 'pr-02',
    boutiqueId: 'bt-luc-01',
    boutiqueName: 'Kashish Chikankari',
    title: 'Ivory Mulberry Chikankari Anarkali Set',
    category: 'Anarkali Suit',
    price: 24200,
    fabric: 'Premium Mulmul and Mulberry Georgette',
    embroidery: 'Intricate Lucknow shadow-work Chikankari weaving',
    colors: ['Ivory white', 'Pastel peach'],
    sizes: ['M', 'L', 'XL'],
    img: 'https://picsum.photos/seed/ivorychikankari/600/800',
    isModerated: true,
    reviewsCount: 8,
    rating: 4.8
  },
  {
    id: 'pr-03',
    boutiqueId: 'bt-jai-01',
    boutiqueName: 'Jaipur Heritage Atelier',
    title: 'Saffron Organza Gota Patti Festive Saree',
    category: 'Saree',
    price: 18900,
    fabric: 'Freespun Sourced Jaipur Organza',
    embroidery: 'Delicate handstitched metallic leaf Gota Patti work',
    colors: ['Marigold saffron', 'Pure Gold border'],
    sizes: ['Standard Freesize'],
    img: 'https://picsum.photos/seed/saffronsaree/600/800',
    isModerated: true,
    reviewsCount: 5,
    rating: 4.7
  },
  {
    id: 'pr-04',
    boutiqueId: 'bt-mum-01',
    boutiqueName: 'Anahita Patel Couturier',
    title: 'Royal Indigo Handblocked Silk Fusion Coat',
    category: 'Fusion Wear',
    price: 15500,
    fabric: 'Azo-Free Handblocked Chanderi Silk',
    embroidery: 'Modern geometric metal thread work',
    colors: ['Royal Indigo', 'Silver'],
    sizes: ['S', 'M'],
    img: 'https://picsum.photos/seed/indigojacket/600/800',
    isModerated: false,
    reviewsCount: 0,
    rating: 0
  }
];

function generateRandomOrderId(): string {
  if (typeof window !== 'undefined') {
    return `RP-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
  }
  return 'RP-ORD-881231';
}

function generateRandomProductId(): string {
  if (typeof window !== 'undefined') {
    return `ai-pr-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  return 'ai-pr-8192';
}

function generateRandomBoutiqueId(): string {
  if (typeof window !== 'undefined') {
    return `bt-new-${Math.floor(100 + Math.random() * 900)}`;
  }
  return 'bt-new-481';
}

export default function DemoPortal() {
  const [activePanel, setActivePanel] = useState<'customer' | 'designer' | 'admin'>('customer');
  
  // Boutique and catalog local database states
  const [boutiques, setBoutiques] = useState<DesignerBoutique[]>(BASE_BOUTIQUES);
  const [products, setProducts] = useState<DressProduct[]>(BASE_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<SimulatedOrder[]>([]);
  const [auditLogs, setAuditLogs] = useState<string[]>([]);
  const [commissionRate, setCommissionRate] = useState<number>(12);

  // Customer filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Checkout Modal State
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [currentOrderTracking, setCurrentOrderTracking] = useState<SimulatedOrder | null>(null);

  // AI Dress Listing Form with Gemini
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [selectedDesignerBoutique, setSelectedDesignerBoutique] = useState('bt-luc-01');

  // Manual Product Upload State
  const [manualTitle, setManualTitle] = useState('');
  const [manualCategory, setManualCategory] = useState('Saree');
  const [manualPrice, setManualPrice] = useState('18500');
  const [manualFabric, setManualFabric] = useState('Chanderi Silk');
  const [manualEmbroidery, setManualEmbroidery] = useState('Gota Patti work');

  // Designer KYC upload simulator
  const [kycBrandName, setKycBrandName] = useState('');
  const [kycCity, setKycCity] = useState('Varanasi');
  const [kycGstin, setKycGstin] = useState('');
  const [kycRegistered, setKycRegistered] = useState(false);

  // Event logger stabilized at the top
  const logEvent = (msg: string) => {
    const formatted = `[${new Date().toLocaleTimeString()}] ${msg}`;
    setAuditLogs(prev => [formatted, ...prev].slice(0, 50));
  };

  // Deferred loading to avoid react-hooks setState synchronous side-effects on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const isClient = typeof window !== 'undefined';
      if (!isClient) return;

      const cachedBoutiques = localStorage.getItem('bt_boutiques');
      const cachedProducts = localStorage.getItem('bt_products');
      const cachedOrders = localStorage.getItem('bt_orders');
      
      if (cachedBoutiques) setBoutiques(JSON.parse(cachedBoutiques));
      if (cachedProducts) setProducts(JSON.parse(cachedProducts));
      if (cachedOrders) setOrders(JSON.parse(cachedOrders));
      
      logEvent("[SYSTEM INITIALIZED] Preloaded standard artisan databases.");
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const saveToLocalStorage = (updatedBoutiques: DesignerBoutique[], updatedProducts: DressProduct[], updatedOrders?: SimulatedOrder[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bt_boutiques', JSON.stringify(updatedBoutiques));
      localStorage.setItem('bt_products', JSON.stringify(updatedProducts));
      if (updatedOrders) {
        localStorage.setItem('bt_orders', JSON.stringify(updatedOrders));
      }
    }
  };

  // Customer panel cart activities
  const handleAddToCart = (product: DressProduct, selectedSize: string) => {
    const existing = cart.find(item => item.product.id === product.id && item.selectedSize === selectedSize);
    if (existing) {
      setCart(cart.map(item => item.product.id === product.id && item.selectedSize === selectedSize ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { product, selectedSize, qty: 1 }]);
    }
    logEvent(`[CART ADDITION] Customer added ${product.title} (Size: ${selectedSize}) to cart.`);
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    setCart(cart.filter(item => !(item.product.id === productId && item.selectedSize === size)));
    logEvent(`[CART DELETION] Removed item ${productId} (Size: ${size}) from cart.`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const gstCost = Math.round(cartTotal * 0.18); // 18% GST
  const deliveryCharge = cartTotal > 0 ? 150 : 0;
  const orderGrandTotal = cartTotal + gstCost + deliveryCharge;

  // Razorpay secure checkout simulator
  const handleProcessCheckout = () => {
    if (cart.length === 0) return;

    // Calculate payouts split
    const commissionFraction = commissionRate / 100;
    const collectedFee = Math.round(cartTotal * commissionFraction);
    const boutiqueSplitPayout = cartTotal - collectedFee;

    const newOrder: SimulatedOrder = {
      id: generateRandomOrderId(),
      customerName: "Buyer Sandbox User",
      items: [...cart],
      itemTotal: cartTotal,
      tax: gstCost,
      grandTotal: orderGrandTotal,
      commissionCollected: collectedFee,
      designerSettlement: boutiqueSplitPayout,
      paymentStatus: 'captured',
      shippingStatus: 'order_placed',
      timelineDates: {
        placed: "Today, Order Checked Out",
        picked: "Pending Dispatch",
        transit: "Shiprocket Router Pending",
        delivery: "Deliver To Registered Node"
      }
    };

    // Update designers analytics & order counts
    const updatedBoutiques = boutiques.map(b => {
      // Find if this boutique had item in cart
      const merchantItemsInOrder = cart.filter(item => item.product.boutiqueId === b.id);
      if (merchantItemsInOrder.length > 0) {
        const vendorSubtotal = merchantItemsInOrder.reduce((sum, item) => sum + item.product.price * item.qty, 0);
        const vendorCollected = vendorSubtotal - Math.round(vendorSubtotal * commissionFraction);
        return {
          ...b,
          revenue: b.revenue + vendorCollected,
          activeOrders: b.activeOrders + 1
        };
      }
      return b;
    });

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    setBoutiques(updatedBoutiques);
    saveToLocalStorage(updatedBoutiques, products, updatedOrders);
    
    setCart([]);
    setCheckoutModal(false);
    setCurrentOrderTracking(newOrder);

    logEvent(`[PAYMENT CAPTURED] Razorpay secured payout allocation: Total ₹${orderGrandTotal.toLocaleString()}. Settled: ₹${boutiqueSplitPayout.toLocaleString()} to boutique bank accounts, platform commission collected: ₹${collectedFee.toLocaleString()} (Rate: ${commissionRate}%).`);
  };

  // Shiprocket dispatch simulation
  const handleUpdateShipping = (orderId: string, nextStatus: 'picked_up' | 'in_transit' | 'delivered') => {
    const updatedOrders = orders.map(o => {
      if (o.id === orderId) {
        const dates = { ...o.timelineDates };
        if (nextStatus === 'picked_up') dates.picked = "Just Now - Picked up by Shiprocket Delhi Delivery Agent";
        if (nextStatus === 'in_transit') dates.transit = "Just Now - Routed through central Lucknow high-speed transit hub";
        if (nextStatus === 'delivered') dates.delivery = "Delivered - Successfully received at buyer gatehouse with physical verification signature";

        return {
          ...o,
          shippingStatus: nextStatus,
          timelineDates: dates
        };
      }
      return o;
    });

    setOrders(updatedOrders);
    saveToLocalStorage(boutiques, products, updatedOrders);
    logEvent(`[SHIPROCKET DESPATCH] Order ${orderId} updated tracking state -> ${nextStatus.toUpperCase()}`);
    
    // update current tracking panel if matches
    if (currentOrderTracking?.id === orderId) {
      const match = updatedOrders.find(v => v.id === orderId);
      if (match) setCurrentOrderTracking(match);
    }
  };

  // Admin approval of boutique
  const handleApproveBoutique = (boutiqueId: string) => {
    const updatedBoutiques = boutiques.map(b => b.id === boutiqueId ? { ...b, isVerified: true } : b);
    
    // Mark products from this boutique as moderated / approved
    const updatedProducts = products.map(p => p.boutiqueId === boutiqueId ? { ...p, isModerated: true } : p);

    setBoutiques(updatedBoutiques);
    setProducts(updatedProducts);
    saveToLocalStorage(updatedBoutiques, updatedProducts, orders);

    const matchBoutique = boutiques.find(b => b.id === boutiqueId);
    logEvent(`[ADMIN AUDIT] Approved identity documents and active licensing credentials for ${matchBoutique?.brandName}. Listings transitioned to ACTIVE shop state.`);
  };

  // Create customized AI listing using server side Gemini generator
  const handleCreateAiDressListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    setAiError('');

    try {
      const resp = await fetch('/app/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt, type: 'design_helper' })
      });

      const resData = await resp.json();

      if (resData.success && resData.text) {
        // Parse Structured response
        const data = JSON.parse(resData.text.replace(/```json|```/g, '').trim());

        const designerBoutique = boutiques.find(b => b.id === selectedDesignerBoutique) || boutiques[0];

        // Create new Dress product
        const newProduct: DressProduct = {
          id: generateRandomProductId(),
          boutiqueId: designerBoutique.id,
          boutiqueName: designerBoutique.brandName,
          title: data.productName || 'Traditional Embroidered masterpiece',
          category: 'Saree',
          price: Number(data.estimatedPrice) || 28500,
          fabric: data.fabric || 'Pure Organza & Silk Chiffon',
          embroidery: data.embroidery || 'Zari embroidery golden embellishment',
          colors: [data.colorPalette || 'Emerald Green with antique Zari borders'],
          sizes: ['S', 'M', 'L', 'XL'],
          img: `https://picsum.photos/seed/${generateRandomProductId()}/600/800`,
          isModerated: designerBoutique.isVerified, // Auto approves if boutique is verified!
          reviewsCount: 0,
          rating: 5.0
        };

        const updatedProducts = [newProduct, ...products];
        setProducts(updatedProducts);
        saveToLocalStorage(boutiques, updatedProducts, orders);
        setAiPrompt('');
        logEvent(`[AI DESIGN GENERATED] Gemini Drafted Listing: "${newProduct.title}" (priced at ₹${newProduct.price.toLocaleString()}) designed under ${designerBoutique.brandName}. Published immediately with high-fashion metadata descriptive tags.`);
      } else {
        setAiError(resData.error || "Generation error: Please configure your API key in Secrets panel.");
      }
    } catch (err: any) {
      console.error(err);
      setAiError("Connection failed to Gemini secure endpoints. Verify credentials inside Secrets console.");
    } finally {
      setAiLoading(false);
    }
  };

  // Onboard new mock Designer boutique KYC
  const handleKycSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycBrandName.trim() || !kycGstin.trim()) return;

    const newBt: DesignerBoutique = {
      id: generateRandomBoutiqueId(),
      brandName: kycBrandName,
      designer: "Boutique Owner Sandbox",
      city: kycCity,
      gstin: kycGstin,
      isVerified: false, // Must be approved by admin panel!
      rating: 5.0,
      revenue: 0,
      activeOrders: 0
    };

    const updatedBoutiques = [...boutiques, newBt];
    setBoutiques(updatedBoutiques);
    saveToLocalStorage(updatedBoutiques, products, orders);
    setKycBrandName('');
    setKycGstin('');
    setKycRegistered(true);

    logEvent(`[MERCHANT SIGNUP] New boutique "${newBt.brandName}" submitted files under city ${newBt.city} with GSTIN ${newBt.gstin}. Awaiting admin moderation verification.`);
  };

  // Filters calculation
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.fabric.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.boutiqueName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCity = selectedCity === 'All' ? true : boutiques.find(b => b.id === p.boutiqueId)?.city === selectedCity;
    const matchCategory = selectedCategory === 'All' ? true : p.category === selectedCategory;
    const matchesModeration = activePanel === 'admin' ? true : p.isModerated; // Admins view unmoderated items too

    return matchesSearch && matchCity && matchCategory && matchesModeration;
  });

  return (
    <div className="bg-[#FAF9F6] p-2 md:p-6 rounded-[40px] border border-[#2D2926]/10 shadow-sm" id="zari-demo-portal-root">
      {/* Navigation Panels Control */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-[#EAE8E4]/30 p-4 rounded-3xl border border-[#2D2926]/10 space-y-3.5 md:space-y-0 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#2D2926] text-[#FAF9F6] flex items-center justify-center">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="font-serif italic font-bold text-[#2D2926] text-base block leading-none">Zarì Simulator</span>
            <span className="text-[9px] font-mono uppercase tracking-widest text-[#8B4513] font-bold mt-1 block">Viraasat Curated Feed</span>
          </div>
          <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-widest bg-[#8B4513]/10 text-[#8B4513] rounded-full border border-[#8B4513]/20">ACTIVE POOL</span>
        </div>
        
        {/* Navigation triggers */}
        <div className="flex items-center space-x-1 p-1 bg-[#EAE8E4]/50 border border-[#2D2926]/10 rounded-full">
          <button
            onClick={() => setActivePanel('customer')}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all ${
              activePanel === 'customer' ? 'bg-[#2D2926] text-white shadow-sm' : 'text-[#2D2926]/75 hover:text-[#8B4513]'
            }`}
          >
            🛍️ Customer Panel
          </button>
          <button
            onClick={() => setActivePanel('designer')}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all ${
              activePanel === 'designer' ? 'bg-[#2D2926] text-white shadow-sm' : 'text-[#2D2926]/75 hover:text-[#8B4513]'
            }`}
          >
            🪡 Designer Studio
          </button>
          <button
            onClick={() => setActivePanel('admin')}
            className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider font-bold transition-all ${
              activePanel === 'admin' ? 'bg-[#2D2926] text-white shadow-sm' : 'text-[#2D2926]/75 hover:text-[#8B4513]'
            }`}
          >
            🛡️ Admin Control
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Core panel interface mapping - col 9 */}
        <div className="xl:col-span-9 bg-white rounded-[32px] border border-[#2D2926]/10 p-5 md:p-8 min-h-[550px]">
          
          {/* =================== CUSTOMER PANEL =================== */}
          {activePanel === 'customer' && (
            <div className="space-y-6">
              {/* Header search controls */}
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search pure silks, gota patti work, Jaipur lehengas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#2D2926]/15 hover:border-[#2D2926]/30 text-sm focus:outline-none focus:ring-1 focus:ring-[#8B4513] focus:border-[#2D2926] bg-[#FAF9F6]/50 transition-colors"
                />
                
                {/* City filters */}
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#2D2926]/15 text-xs text-[#2D2926]/80 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B4513]"
                >
                  <option value="All">All Indian Cities</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Jaipur">Jaipur</option>
                  <option value="Mumbai">Mumbai</option>
                </select>

                {/* Category tags */}
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2.5 rounded-xl border border-[#2D2926]/15 text-xs text-[#2D2926]/80 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#8B4513]"
                >
                  <option value="All">All Categories</option>
                  <option value="Lehenga">Lehengas</option>
                  <option value="Saree">Sarees</option>
                  <option value="Anarkali Suit">Anarkali & Suits</option>
                  <option value="Fusion Wear">Fusion & Modern</option>
                </select>
              </div>

              {/* Product layouts grid inspired by Pinterest and Myntra Luxe */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const boutique = boutiques.find(b => b.id === p.boutiqueId);
                  return (
                    <div key={p.id} className="group flex flex-col justify-between relative bg-[#FAF9F6]/30 border border-[#2D2926]/10 rounded-[32px] p-3.5 hover:shadow-sm hover:border-[#2D2926]/20 transition-all duration-350 h-full">
                      <div>
                        {/* Product dress image placeholder with beautiful custom curve */}
                        <div className="relative aspect-[3/4] w-full bg-[#E5E3DF] rounded-[24px] overflow-hidden">
                          <img
                            src={p.img}
                            alt={p.title}
                            referrerPolicy="no-referrer"
                            className="object-cover w-full h-full group-hover:scale-103 transition-all duration-500"
                          />
                          {/* Boutique Badge floating in corner */}
                          <div className="absolute top-3 left-3 bg-[#FAF9F6]/90 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-mono tracking-wider text-[#2D2926] flex items-center space-x-1 shadow-sm border border-[#2D2926]/10">
                            <MapPin className="w-2.5 h-2.5 text-[#8B4513]" />
                            <span>{boutique?.city || 'India'}</span>
                          </div>
                        </div>

                        {/* Info and metadata */}
                        <div className="pt-4 px-1 pb-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono tracking-widest text-[#8B4513] uppercase font-bold">{p.category}</span>
                            <span className="text-[9px] text-[#2D2926]/50">Rating {p.rating || 'New'} ★</span>
                          </div>
                          
                          <h4 className="font-serif italic text-base font-light text-[#2D2926] leading-tight mt-1 truncate group-hover:text-[#8B4513] transition-colors" title={p.title}>
                            {p.title}
                          </h4>
                          <p className="text-[11px] uppercase tracking-wider text-[#2D2926]/60 font-medium mt-1 truncate">{p.boutiqueName}</p>
                          
                          <div className="flex items-baseline space-x-2 mt-2">
                            <span className="text-base font-serif italic text-[#8B4513]">₹{p.price.toLocaleString()}</span>
                            <span className="text-[11px] text-[#2D2926]/40 line-through">₹{(p.price * 1.35).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>
                            <span className="text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">(35% OFF)</span>
                          </div>

                          <div className="text-[10px] text-[#2D2926]/60 mt-3 font-mono space-y-0.5 border-t border-[#2D2926]/5 pt-2">
                            <p className="truncate"><span className="opacity-60">Fabric:</span> {p.fabric}</p>
                            <p className="truncate"><span className="opacity-60">Embroidery:</span> {p.embroidery}</p>
                          </div>
                        </div>
                      </div>

                      {/* Sizes list + Add to cart buttons */}
                      <div className="mt-4 pt-3 border-t border-[#2D2926]/10 px-1 flex items-center justify-between gap-1.5">
                        <div className="flex flex-wrap gap-1">
                          {p.sizes.map((s) => (
                            <button
                              key={s}
                              onClick={() => handleAddToCart(p, s)}
                              className="px-2.5 py-1 text-[9px] font-mono font-bold bg-[#EAE8E4]/60 hover:bg-[#2D2926] hover:text-[#FAF9F6] rounded-md border border-[#2D2926]/10 text-[#2D2926] transition-all shrink-0"
                              title={`Add size ${s}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-[#2D2926]/50 font-mono">ADD SIZE</span>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-16 text-center text-[#2D2926]/60 bg-[#EAE8E4]/25 rounded-[24px] border border-dashed border-[#2D2926]/15">
                    <p className="text-sm font-serif">No luxury garments match your active lookup tags.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================== DESIGNER STUDIO =================== */}
          {activePanel === 'designer' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Onboard Boutique or list current merchant details */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="p-5 border border-[#2D2926]/10 bg-[#EAE8E4]/25 rounded-2xl relative overflow-hidden">
                    <h4 className="font-serif italic font-bold text-[#2D2926] text-base">Boutique KYCs Register</h4>
                    <p className="text-xs text-[#2D2926]/70 leading-relaxed mt-1">Submit licensing to start listing catalog attire.</p>

                    {kycRegistered ? (
                      <div className="mt-4 bg-emerald-50 border border-emerald-150 p-3 rounded-lg text-emerald-800 text-xs">
                        <Check className="w-5 h-5 mb-1" />
                        <strong>Boutique Filed Awaiting Admin!</strong> Use Admin Control tab to trigger approval.
                      </div>
                    ) : (
                      <form onSubmit={handleKycSignup} className="space-y-3.5 mt-4">
                        <div>
                          <label className="text-[9px] font-mono tracking-wider uppercase text-[#2D2926]/50">BRAND NAME</label>
                          <input
                            type="text"
                            required
                            placeholder="Zebaish Couturiers"
                            value={kycBrandName}
                            onChange={(e) => setKycBrandName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#2D2926]/15 bg-white focus:outline-none focus:ring-1 focus:ring-[#8B4513]"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-mono tracking-wider uppercase text-[#2D2926]/50 font-bold block mb-1">CITY CLUSTER</label>
                          <select
                            value={kycCity}
                            onChange={(e) => setKycCity(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#2D2926]/15 bg-white focus:outline-none"
                          >
                            <option value="Varanasi">Varanasi (Silk Weaving)</option>
                            <option value="Lucknow">Lucknow (Chikankari)</option>
                            <option value="Jaipur">Jaipur (Gota Patti)</option>
                            <option value="Mumbai">Mumbai (Fusion)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[9px] font-mono tracking-wider uppercase text-[#2D2926]/50">GSTIN TAX REGCODE</label>
                          <input
                            type="text"
                            required
                            placeholder="15-digit GSTIN"
                            value={kycGstin}
                            onChange={(e) => setKycGstin(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#2D2926]/15 bg-white focus:outline-none font-mono"
                          />
                        </div>
                        <button type="submit" className="w-full bg-[#2D2926] hover:bg-[#8B4513] text-[#FAF9F6] text-xs py-2 rounded-lg font-medium transition-all shadow-sm">
                          Register & Upload PDF
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Active Designer Stats list */}
                  <div className="p-4 border border-[#2D2926]/10 rounded-2xl bg-[#EAE8E4]/20">
                    <p className="text-[10px] font-mono uppercase text-[#2D2926]/60 tracking-wider">ACTIVE BOUTIQUE SCORES</p>
                    <div className="space-y-2.5 mt-3">
                      {boutiques.map(b => (
                        <div key={b.id} className="flex justify-between items-center text-xs">
                          <div>
                            <span className="font-semibold text-[#2D2926] block">{b.brandName}</span>
                            <span className="text-[10px] text-[#2D2926]/50">{b.city} • Verified: {b.isVerified ? '🛡️ YES':'⏳ NO'}</span>
                          </div>
                          <span className="font-mono font-bold text-[#8B4513]">₹{b.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Gemini AI Listing Creator */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="border border-[#2D2926]/10 p-6 rounded-[28px] bg-gradient-to-br from-white to-[#EAE8E4]/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#8B4513]/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex items-center space-x-2 pb-3 border-b border-[#2D2926]/10">
                      <Sparkles className="w-5 h-5 text-[#8B4513]" />
                      <div>
                        <h4 className="font-serif italic font-bold text-[#2D2926] text-base">Zari Co-Designer Studio listings Generator</h4>
                        <p className="text-xs text-[#2D2926]/70">Brainstorm with Gemini. Auto generate complete boutique dress listings.</p>
                      </div>
                    </div>

                    <form onSubmit={handleCreateAiDressListing} className="space-y-4 mt-4">
                      <div>
                        <label className="text-[9px] font-mono tracking-wider uppercase text-[#2D2926]/50 block mb-1">SELECT TARGET ACTIVE BOUTIQUE</label>
                        <select
                          value={selectedDesignerBoutique}
                          onChange={(e) => setSelectedDesignerBoutique(e.target.value)}
                          className="px-3 py-1.5 rounded-lg border border-[#2D2926]/15 text-xs text-[#2D2926]/80 bg-white focus:outline-none"
                        >
                          {boutiques.map(b => (
                            <option key={b.id} value={b.id}>{b.brandName} ({b.city})</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-[9px] font-mono tracking-wider uppercase text-[#2D2926]/50 block mb-1.5">GARMENT CREATIVE BRIEF & CONCEPT</label>
                        <textarea
                          placeholder="e.g.: Saffron pure organza hand-blocked saree with silver gotapatti stitch borders and a silk matching crimson color blouse piece..."
                          value={aiPrompt}
                          onChange={(e) => setAiPrompt(e.target.value)}
                          className="w-full px-4 py-2 text-xs rounded-lg border border-[#2D2926]/15 hover:border-[#2D2926]/30 focus:outline-none focus:ring-1 focus:ring-[#8B4513] bg-white min-h-[100px] text-[#2D2926]"
                          disabled={aiLoading}
                        />
                      </div>

                      {aiError && (
                        <div className="p-3 bg-red-50 border border-red-100 text-xs text-red-700 rounded-lg flex items-center space-x-2 font-mono">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{aiError}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-[#2D2926]/50 flex items-center space-x-1 font-mono uppercase tracking-wider">
                          <ShieldAlert className="w-3.5 h-3.5 text-[#8B4513]" />
                          <span>AI utilizes server proxy keys</span>
                        </span>
                        
                        <button
                          type="submit"
                          className="bg-[#2D2926] hover:bg-[#8B4513] text-[#FAF9F6] font-medium text-xs px-4.5 py-2 rounded-lg shadow-sm transition-all flex items-center space-x-1.5 cursor-pointer"
                          disabled={aiLoading || !aiPrompt.trim()}
                        >
                          {aiLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Asking Gemini...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Publish with Gemini AI</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Orders dispatched tracking list inside merchant */}
                  <div className="border rounded-xl p-5 bg-white space-y-4">
                    <h4 className="font-serif font-bold text-slate-800 text-sm">Shipments & Shiprocket Management</h4>
                    <p className="text-xs text-slate-500">Boutiques dispatch processed attire using Shiprocket visual tracking logs.</p>

                    <div className="space-y-3.5">
                      {orders.map(o => (
                        <div key={o.id} className="p-4 border rounded-xl flex flex-col md:flex-row md:justify-between md:items-center gap-3.5 text-xs">
                          <div>
                            <span className="font-mono font-bold text-brand-600">{o.id}</span>
                            <p className="text-slate-500 mt-1">Amount: ₹{o.grandTotal.toLocaleString()} • Buyer: {o.customerName}</p>
                            <span className="mt-1.5 inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-amber-50 text-amber-700 uppercase">
                              Shiprocket: {o.shippingStatus.replace('_', ' ')}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 md:flex-row items-center">
                            {o.shippingStatus === 'order_placed' && (
                              <button
                                onClick={() => handleUpdateShipping(o.id, 'picked_up')}
                                className="bg-slate-800 text-white text-[10px] px-3 py-1.5 rounded hover:bg-slate-900 transition-all font-mono uppercase"
                              >
                                Book Courier Pick (Mumbai Base)
                              </button>
                            )}
                            {o.shippingStatus === 'picked_up' && (
                              <button
                                onClick={() => handleUpdateShipping(o.id, 'in_transit')}
                                className="bg-amber-500 text-white text-[10px] px-3 py-1.5 rounded hover:bg-amber-600 transition-all font-mono uppercase"
                              >
                                Dispatch Outward (In Transit)
                              </button>
                            )}
                            {o.shippingStatus === 'in_transit' && (
                              <button
                                onClick={() => handleUpdateShipping(o.id, 'delivered')}
                                className="bg-emerald-600 text-white text-[10px] px-3 py-1.5 rounded hover:bg-emerald-700 transition-all font-mono uppercase"
                              >
                                Confirm physical Sign Delivery
                              </button>
                            )}
                            <button
                              onClick={() => setCurrentOrderTracking(o)}
                              className="text-slate-500 hover:text-brand-500 text-[10px] border px-2.5 py-1.5 rounded block text-center"
                            >
                              Track Live Transit
                            </button>
                          </div>
                        </div>
                      ))}

                      {orders.length === 0 && (
                        <p className="text-center py-6 text-slate-400 text-xs">No active orders placed inside checkout panel.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================== ADMIN CONTROL =================== */}
          {activePanel === 'admin' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 border border-[#2D2926]/10 rounded-2xl bg-[#EAE8E4]/20 text-[#2D2926]">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-[#2D2926]/50 block uppercase">Split Payouts Settings</span>
                  <div className="mt-3">
                    <label className="text-xs text-[#2D2926]/80 flex justify-between font-medium">
                      <span>Market Commission Rate</span>
                      <strong className="text-[#8B4513] font-bold">{commissionRate}%</strong>
                    </label>
                    <input
                      type="range"
                      min="5"
                      max="25"
                      step="1"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(Number(e.target.value))}
                      className="w-full accent-[#8B4513] mt-2 cursor-pointer"
                    />
                    <span className="text-[9px] text-[#2D2926]/50 block mt-1">Deducted from gross boutique revenue during Razorpay settlements.</span>
                  </div>
                </div>

                <div className="p-5 border border-[#2D2926]/10 rounded-2xl bg-[#EAE8E4]/20 flex flex-col justify-between text-[#2D2926]">
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-[#2D2926]/50 block uppercase">Awaiting Curation Verifies</span>
                    <strong className="text-xl font-serif text-[#2D2926] block mt-1.5">
                      {boutiques.filter(b => !b.isVerified).length} Boutiques Pending
                    </strong>
                  </div>
                  <span className="text-[9px] text-[#8B4513] block mt-1">Require manual legal, business tax PAN & GSTIN check.</span>
                </div>

                <div className="p-5 border border-[#2D2926]/10 rounded-2xl bg-[#EAE8E4]/20 flex flex-col justify-between text-[#2D2926]">
                  <div>
                    <span className="text-[9px] font-mono font-bold tracking-wider text-[#2D2926]/50 block uppercase">Awaiting Dress moderation</span>
                    <strong className="text-xl font-serif text-[#2D2926] block mt-1.5">
                      {products.filter(p => !p.isModerated).length} Items Listed
                    </strong>
                  </div>
                  <span className="text-[9px] text-[#2D2926]/50 block mt-1">Filters out non-artisinal machine stitched garments.</span>
                </div>
              </div>

              {/* Approval Lists and workflows */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Onboarding queues */}
                <div className="border border-[#2D2926]/10 rounded-2xl p-5 bg-white space-y-4">
                  <h4 className="font-serif italic font-bold text-[#2D2926] text-sm">Boutique verification verification queues</h4>
                  <div className="space-y-3">
                    {boutiques.map(b => (
                      <div key={b.id} className="p-3.5 border border-[#2D2926]/10 rounded-xl flex justify-between items-center text-xs bg-[#FAF9F6]/50">
                        <div>
                          <strong className="text-[#2D2926] block">{b.brandName}</strong>
                          <span className="text-[10px] text-[#2D2926]/50">GST: {b.gstin} • {b.city}</span>
                        </div>
                        {b.isVerified ? (
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center">
                            <Check className="w-4 h-4 mr-1" /> Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => handleApproveBoutique(b.id)}
                            className="bg-[#2D2926] hover:bg-[#8B4513] text-white text-[10px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer font-bold uppercase tracking-wider"
                          >
                            Verify & Activate
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Moderation products items */}
                <div className="border border-[#2D2926]/10 rounded-2xl p-5 bg-white space-y-4">
                  <h4 className="font-serif italic font-bold text-[#2D2926] text-sm">Listed Dress Items moderation Workspace</h4>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    {products.map(p => (
                      <div key={p.id} className="p-3.5 border border-[#2D2926]/10 rounded-xl flex justify-between items-center text-xs bg-[#FAF9F6]/50">
                        <div className="flex items-center space-x-2.5 truncate">
                          <img src={p.img} alt="" className="w-10 h-10 object-cover rounded-lg border border-[#2D2926]/10" />
                          <div className="truncate">
                            <strong className="text-[#2D2926] block truncate">{p.title}</strong>
                            <span className="text-[10px] text-[#2D2926]/50 block truncate font-mono">Price: ₹{p.price.toLocaleString()} • Vendor: {p.boutiqueName}</span>
                          </div>
                        </div>

                        {p.isModerated ? (
                          <span className="text-[10px] text-emerald-700 font-bold shrink-0 flex items-center">
                            <Check className="w-3.5 h-3.5 mr-1" /> Checked
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              const updatedProducts = products.map(item => item.id === p.id ? { ...item, isModerated: true } : item);
                              setProducts(updatedProducts);
                              saveToLocalStorage(boutiques, updatedProducts, orders);
                              logEvent(`[ADMIN AUDIT] Approved item moderation: "${p.title}" successfully vetted for platform authenticity.`);
                            }}
                            className="bg-[#2D2926] hover:bg-[#8B4513] text-white text-[9px] px-2.5 py-1.5 rounded-lg shrink-0 transition-all font-mono uppercase"
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transaction state sidebar logs - col 3 */}
        <div className="xl:col-span-3 space-y-6">
          {/* Cart display if customer is selected */}
          {activePanel === 'customer' && (
            <div className="p-5 border border-[#2D2926]/10 bg-white rounded-[24px] shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b border-[#2D2926]/5 pb-2.5">
                <h4 className="font-serif italic font-bold text-[#2D2926] text-sm flex items-center">
                  <ShoppingBag className="w-4 h-4 mr-2 text-[#8B4513]" /> Secure Cart
                </h4>
                <span className="bg-[#EAE8E4] text-[#2D2926] text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                  {cart.reduce((sum, item) => sum + item.qty, 0)}
                </span>
              </div>

              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-start text-xs border-b border-dashed border-[#2D2926]/10 pb-2.5 last:border-0 last:pb-0">
                    <div className="truncate pr-4">
                      <strong className="text-[#2D2926] block truncate">{item.product.title}</strong>
                      <span className="text-[10px] text-[#2D2926]/60 block mt-0.5">Size {item.selectedSize} • Qty: {item.qty} • {item.product.boutiqueName}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif italic font-bold text-[#8B4513]">₹{(item.product.price * item.qty).toLocaleString()}</span>
                      <button
                        onClick={() => handleRemoveFromCart(item.product.id, item.selectedSize)}
                        className="text-slate-400 hover:text-[#8B4513] block ml-auto mt-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                {cart.length === 0 && (
                  <p className="text-center py-6 text-[#2D2926]/50 text-xs font-serif">Your shopping bag is empty.</p>
                )}
              </div>

              {cart.length > 0 && (
                <div className="space-y-2 border-t border-[#2D2926]/5 pt-3.5 text-xs">
                  <div className="flex justify-between text-[#2D2926]/70">
                    <span>Retail Goods Gross</span>
                    <span>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#2D2926]/70">
                    <span>Collective Tax GST (18%)</span>
                    <span>₹{gstCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#2D2926]/70">
                    <span>Shiprocket Insured Delivery</span>
                    <span>₹{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-[#2D2926]/10 pt-2.5 text-[#2D2926] text-sm">
                    <span>Order Total (INR)</span>
                    <span className="font-serif italic font-bold text-[#8B4513]">₹{orderGrandTotal.toLocaleString()}</span>
                  </div>
                  
                  <button
                    onClick={() => setCheckoutModal(true)}
                    className="w-full bg-[#2D2926] hover:bg-[#8B4513] text-white font-medium text-xs py-2.5 rounded-lg block text-center mt-4 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    Proceed with Razorpay Checkout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* System Audit logs sidebar always visible below */}
          <div className="p-4 border border-[#2D2926]/15 bg-[#2D2926] rounded-[24px] text-[#FAF9F6] font-mono text-[10px] space-y-3 min-h-[220px]">
            <p className="text-emerald-400 font-bold uppercase tracking-widest border-b border-white/10 pb-2">
              Platform Transaction ledgers
            </p>
            <div className="space-y-1.5 max-h-[200px] overflow-y-auto pr-1">
              {auditLogs.map((log, lidx) => (
                <p key={lidx} className="text-[#FAF9F6]/80 leading-normal border-b border-white/5 pb-1.5 last:border-0 last:pb-0">
                  {log}
                </p>
              ))}
              {auditLogs.length === 0 && (
                <p className="text-slate-500">System idle. Actions performed paint logs trace here.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RAZORPAY SPLIT POPUP MODAL SIMULATOR */}
      {checkoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border border-[#2D2926]/10 rounded-[28px] p-6 max-w-md w-full shadow-2xl relative overflow-hidden">
            <span className="absolute top-0 left-0 w-full h-1.5 bg-[#8B4513]"></span>
            
            <div className="flex items-center space-x-2 text-[#2D2926] font-serif italic font-bold mb-3 border-b border-[#2D2926]/10 pb-2.5 text-sm justify-between">
              <span className="flex items-center"><BadgePercent className="w-5 h-5 mr-1 text-[#8B4513]" /> RAZORPAY SPLIT GATEWAY</span>
              <button onClick={() => setCheckoutModal(false)} className="text-[#2D2926]/50 hover:text-[#2D2926] text-sm cursor-pointer">✕</button>
            </div>

            <p className="text-xs text-[#2D2926]/70 leading-relaxed mb-4">
              Razorpay API captures unified transactions from premium customers and triggers automatic splits to verified designer bank accounts.
            </p>

            {/* Split breakdown visualization */}
            <div className="space-y-3 bg-[#EAE8E4]/25 border border-[#2D2926]/10 p-4 rounded-xl text-xs mb-4">
              <div className="flex justify-between font-bold text-[#2D2926] border-b border-[#2D2926]/10 pb-1.5 mb-1.5">
                <span>Secure Payment Collected</span>
                <span>₹{orderGrandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#2D2926]/80">
                <span>Total Items value (INR)</span>
                <span>₹{cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#2D2926]/60">
                <span>Collective Tax GST (18%)</span>
                <span>₹{gstCost.toLocaleString()}</span>
              </div>
              
              {/* Split logic dynamically using Commission slider state */}
              <div className="p-2.5 bg-[#FAF9F6]/50 border border-[#2D2926]/10 rounded-lg text-[11px] space-y-1.5 mt-3.5">
                <span className="text-[10px] font-mono text-[#8B4513] font-bold uppercase block">Split Ledger entries</span>
                <div className="flex justify-between text-[#2D2926]/80">
                  <span>Artisan Gross (Gross - {commissionRate}%)</span>
                  <strong className="text-[#2D2926]">₹{(cartTotal - Math.round(cartTotal * (commissionRate / 100))).toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-[#2D2926]/80">
                  <span>Platform Commission fee ({commissionRate}%)</span>
                  <strong className="text-[#8B4513]">₹{Math.round(cartTotal * (commissionRate / 100)).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setCheckoutModal(false)} className="flex-1 py-2 text-xs border border-[#2D2926]/10 rounded-lg hover:bg-[#EAE8E4]/20 text-[#2D2926]/70 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleProcessCheckout} className="flex-1 py-2 text-xs bg-[#2D2926] hover:bg-[#8B4513] text-[#FAF9F6] font-medium rounded-lg shadow-sm cursor-pointer uppercase tracking-wider font-bold">
                Secure Capture Split Payouts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHIPROCKET LOGISTICS MODAL SIMULATOR */}
      {currentOrderTracking && (
        <div className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#FAF9F6] border border-[#2D2926]/10 rounded-[28px] p-6 max-w-lg w-full shadow-2xl relative overflow-hidden">
            <span className="absolute top-0 left-0 w-full h-1.5 bg-[#8B4513]"></span>
            
            <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-[#2D2926]/10">
              <div className="flex items-center space-x-2 text-[#2D2926]">
                <Truck className="w-4.5 h-4.5 text-[#8B4513]" />
                <span className="font-serif italic font-bold text-[#2D2926] text-sm">Shiprocket Smart Logistics Tracker</span>
              </div>
              <button onClick={() => setCurrentOrderTracking(null)} className="text-[#2D2926]/40 hover:text-[#2D2926] text-sm cursor-pointer">✕</button>
            </div>

            <div className="mb-4 bg-[#EAE8E4]/20 border border-[#2D2926]/5 p-3.5 rounded-xl text-xs text-[#2D2926]">
              <div className="flex justify-between font-mono font-bold text-[#2D2926] mb-1">
                <span>ORDER CODE:</span>
                <span className="text-[#8B4513]">{currentOrderTracking.id}</span>
              </div>
              <p className="text-[#2D2926]/70">Carrier: Shiprocket Premium (Delhivery Partner Engine)</p>
            </div>

            {/* Tracking Milestones vertical list */}
            <div className="space-y-6 relative border-l-2 border-[#8B4513]/25 ml-4.5 pl-6 my-4 text-xs">
              
              {/* Order Checked Out */}
              <div className="relative">
                <span className="absolute -left-[31px] top-0 w-3 h-3 bg-[#8B4513] rounded-full"></span>
                <strong className="text-[#2D2926] block font-serif italic">Order Checkout Cleared (Varanasi Node)</strong>
                <span className="text-[10px] text-[#2D2926]/50 mt-0.5 block font-mono">{currentOrderTracking.timelineDates.placed}</span>
              </div>

              {/* Picked up */}
              <div className="relative">
                <span className={`absolute -left-[31px] top-0 w-3 h-3 rounded-full ${
                  ['picked_up', 'in_transit', 'delivered'].includes(currentOrderTracking.shippingStatus) ? 'bg-[#8B4513]' : 'bg-[#EAE8E4]'
                }`}></span>
                <strong className={`block font-serif italic ${['picked_up', 'in_transit', 'delivered'].includes(currentOrderTracking.shippingStatus) ? 'text-[#2D2926]' : 'text-slate-400'}`}>
                  Courier Picked Up (Boutique Dispatch)
                </strong>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">{currentOrderTracking.timelineDates.picked}</span>
              </div>

              {/* Transit */}
              <div className="relative">
                <span className={`absolute -left-[31px] top-0 w-3 h-3 rounded-full ${
                  ['in_transit', 'delivered'].includes(currentOrderTracking.shippingStatus) ? 'bg-[#8B4513]' : 'bg-[#EAE8E4]'
                }`}></span>
                <strong className={`block font-serif italic ${['in_transit', 'delivered'].includes(currentOrderTracking.shippingStatus) ? 'text-[#2D2926]' : 'text-slate-400'}`}>
                  Central Regional Transit Routing
                </strong>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">{currentOrderTracking.timelineDates.transit}</span>
              </div>

              {/* Delivered */}
              <div className="relative">
                <span className={`absolute -left-[31px] top-0 w-3 h-3 rounded-full ${
                  currentOrderTracking.shippingStatus === 'delivered' ? 'bg-[#8B4513]' : 'bg-[#EAE8E4]'
                }`}></span>
                <strong className={`block font-serif italic ${currentOrderTracking.shippingStatus === 'delivered' ? 'text-[#2D2926]': 'text-slate-400'}`}>
                  Garment Delivered & Standard Cleared
                </strong>
                <span className="text-[10px] text-slate-400 mt-0.5 block font-mono">{currentOrderTracking.timelineDates.delivery}</span>
              </div>
            </div>

            <button onClick={() => setCurrentOrderTracking(null)} className="w-full bg-[#2D2926] hover:bg-[#8B4513] text-white text-xs py-2.5 rounded-lg transition-all font-medium mt-4 cursor-pointer">
              Close Tracking panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
