export interface DBTable {
  name: string;
  description: string;
  fields: { name: string; type: string; constraints: string; desc: string }[];
  indexes: string[];
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  headers: string[];
  requestPayload?: string;
  responsePayload: string;
}

export const PRD_DATA = {
  title: "Zari Marketplace - PRD v1.0",
  executiveSummary: "Zari is a premium multi-vendor fashion marketplace designed exclusively for Indian indie dress designers and boutique owners. The platform digitizes heritage crafts (e.g., Banarasi, Chikankari, Gota Patti) by linking localized boutique clusters (Varanasi, Lucknow, Jaipur) directly with global buyers. Combining high-fidelity curated styling, AWS performance, and secure, trust-building financial flows.",
  goals: [
    { target: "Local Boutique Empowerment", metric: "Convert traditional offline merchants to direct-to-consumer digital channels with standard identity checkups." },
    { target: "Exceptional UI/UX Elegance", metric: "Evoke a digital bridal-atelier experience inspired by Myntra Luxe, Pinterest, and Etsy." },
    { target: "Secured Trust & Zero Leakage", metric: "Enforce automated payments split (Razorpay Split Settlement) and verified reviews to prevent market fraud." }
  ],
  userPersonas: [
    { role: "Designers & Boutique Owners", needs: "Simple catalog uploads, automated payouts in INR, and quick logistics coordination without expensive tech staff." },
    { role: "Premium Fashion Buyers", needs: "Access to authentic handloom crafts, sizing certainty, secure localized checkout (UPI/Cards), and crystal-clear shipment tracking." },
    { role: "Platform Administrators", needs: "Onboarding curation workflows, listing moderation to block non-handmade items, dynamic commission controls, and audit trails." }
  ],
  epics: [
    { id: "EP-01", title: "Merchant KYC & Boutique Onboarding", details: "Self-serve registration with PAN card, GSTIN verification, and bank payout credential checks. Requires manual admin validation before listings go active." },
    { id: "EP-02", title: "AI-Powered Direct Listings", details: "Enables designers to upload product images/videos and utilize a Gemini co-design server assistant to draft aesthetic, heritage-specific copy (fabric, needlework detail) and generate commercial pricing ideas." },
    { id: "EP-03", title: "Split-Settlement Checkout (Razorpay Multi-Split)", details: "A customer places a single order with items from Varanasi and Lucknow boutiques. The system calculates platform fees, tax, and programs dynamic payment splits directly to each designer's bank account." },
    { id: "EP-04", title: "Shiprocket Smart Shipping Routing", details: "Automates packaging label generation, merchant pickup alerts, and customer transit state tracking synchronously across different boutique warehouses." }
  ],
  nonFunctional: [
    { aspect: "Security", req: "Private S3 buckets with KMS encryption, HTTPS-only connections, OWASP strict input sanitization, and administrative 2-Factor Authentication." },
    { aspect: "Performance & Latency", req: "Under 2.2s fully loaded interactive page, Redis cache keys for database query optimization, and localized cloudfront nodes across tier-2 cities." },
    { aspect: "Data Durability", req: "PostgreSQL transaction isolation with continuous backups, and structured system logs recording all balance changes, approvals, and payouts." }
  ]
};

export const SCHEMA_DATA: DBTable[] = [
  {
    name: "users",
    description: "Core credentials and authentication record mapping roles.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", desc: "Unique user identifier" },
      { name: "email", type: "varchar(255)", constraints: "UNIQUE NOT NULL", desc: "Email address for login" },
      { name: "encrypted_password", type: "varchar(255)", constraints: "NOT NULL", desc: "Bcrypt hash password key" },
      { name: "phone_number", type: "varchar(20)", constraints: "UNIQUE", desc: "OTP communication channel" },
      { name: "role", type: "enum", constraints: "DEFAULT 'customer' (customer, designer, admin)", desc: "RBAC security role mapping" },
      { name: "two_factor_secret", type: "varchar(255)", constraints: "NULL", desc: "TOTP encryption key for admins" },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT NOW()", desc: "Creation date" }
    ],
    indexes: ["CREATE INDEX idx_users_email ON users(email);", "CREATE INDEX idx_users_role ON users(role);"]
  },
  {
    name: "boutiques",
    description: "Designer shop profiles representing verified local Indian brands.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", desc: "Unique boutique identifiers" },
      { name: "owner_id", type: "uuid", constraints: "REFERENCES users(id) ON DELETE RESTRICT", desc: "Foreign key pointer to users" },
      { name: "brand_name", type: "varchar(255)", constraints: "NOT NULL", desc: "Boutique brand label (e.g. Kashish Boutique)" },
      { name: "city", type: "varchar(100)", constraints: "NOT NULL", desc: "Boutique town registry (Varanasi, Jaipur, etc.)" },
      { name: "gstin", type: "varchar(15)", constraints: "UNIQUE", desc: "India Goods & Services Tax Identification" },
      { name: "pan_card", type: "varchar(10)", constraints: "NOT NULL", desc: "Merchant PAN credential" },
      { name: "is_verified", type: "boolean", constraints: "DEFAULT FALSE", desc: "Verification approval status" },
      { name: "razorpay_account_id", type: "varchar(100)", constraints: "NULL", desc: "Custom node for merchants payouts" },
      { name: "bank_account", type: "jsonb", constraints: "NOT NULL", desc: "IFSC and Account values (encrypted)" }
    ],
    indexes: ["CREATE INDEX idx_boutiques_verified ON boutiques(is_verified);", "CREATE INDEX idx_boutiques_city ON boutiques(city);"]
  },
  {
    name: "dress_items",
    description: "Curated artisan listings with fabric and price attributes.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", desc: "Product code identification" },
      { name: "boutique_id", type: "uuid", constraints: "REFERENCES boutiques(id) ON DELETE CASCADE", desc: "Owner brand node" },
      { name: "title", type: "varchar(255)", constraints: "NOT NULL", desc: "Display title (e.g., Silk Saree)" },
      { name: "category", type: "varchar(100)", constraints: "NOT NULL", desc: "Tags (Lehenga, Saree, etc.)" },
      { name: "price_inr", type: "numeric(12,2)", constraints: "NOT NULL CHECK (price_inr > 0)", desc: "Retail price in rupees" },
      { name: "fabric", type: "text", constraints: "NOT NULL", desc: "Detailed textile mapping" },
      { name: "embroidery_type", type: "varchar(150)", constraints: "NULL", desc: "Chikankari, Zardozi patterns" },
      { name: "sizes", type: "varchar(10)[]", constraints: "NOT NULL", desc: "Available sizes (S, M, L, XL etc)" },
      { name: "colors", type: "varchar(50)[]", constraints: "NOT NULL", desc: "Color options" },
      { name: "images", type: "varchar(500)[]", constraints: "NOT NULL", desc: "S3 public file URIs array" },
      { name: "status", type: "varchar(50)", constraints: "DEFAULT 'pending_review'", desc: "active, pending_review, suspended" }
    ],
    indexes: ["CREATE INDEX idx_dress_merchant ON dress_items(boutique_id);", "CREATE INDEX idx_dress_status ON dress_items(status);", "CREATE INDEX idx_dress_category ON dress_items(category);"]
  },
  {
    name: "orders",
    description: "Multi-vendor client checkout records.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", desc: "Unique order code" },
      { name: "customer_id", type: "uuid", constraints: "REFERENCES users(id)", desc: "Buyer identification" },
      { name: "total_amount_inr", type: "numeric(12,2)", constraints: "NOT NULL", desc: "Grand total" },
      { name: "razorpay_order_id", type: "varchar(255)", constraints: "UNIQUE NOT NULL", desc: "Razorpay payment reference" },
      { name: "payment_status", type: "varchar(50)", constraints: "DEFAULT 'pending' (pending, authorized, captured, failed)", desc: "Gateway status flag" },
      { name: "created_at", type: "timestamp with time zone", constraints: "DEFAULT NOW()", desc: "Purchase timestamp" }
    ],
    indexes: ["CREATE INDEX idx_orders_customer ON orders(customer_id);", "CREATE INDEX idx_orders_rp_id ON orders(razorpay_order_id);"]
  },
  {
    name: "order_items",
    description: "Granular dress purchase breakdown containing split shipping routes.",
    fields: [
      { name: "id", type: "uuid", constraints: "PRIMARY KEY DEFAULT gen_random_uuid()", desc: "Item line identifier" },
      { name: "order_id", type: "uuid", constraints: "REFERENCES orders(id) ON DELETE CASCADE", desc: "Parent transaction" },
      { name: "dress_item_id", type: "uuid", constraints: "REFERENCES dress_items(id)", desc: "Garment purchased" },
      { name: "boutique_id", type: "uuid", constraints: "REFERENCES boutiques(id)", desc: "Vendor target" },
      { name: "selected_size", type: "varchar(10)", constraints: "NOT NULL", desc: "Specified buyer fit" },
      { name: "price_item_inr", type: "numeric(12,2)", constraints: "NOT NULL", desc: "Price paid for this single item" },
      { name: "commission_rate", type: "numeric(5,2)", constraints: "NOT NULL", desc: "Marketplace commission slice" },
      { name: "shiprocket_awb_code", type: "varchar(100)", constraints: "NULL", desc: "Shiprocket tracking number" },
      { name: "fulfillment_status", type: "varchar(50)", constraints: "DEFAULT 'unfulfilled'", desc: "unfulfilled, pick_booked, transit, delivered, returned" }
    ],
    indexes: ["CREATE INDEX idx_order_items_boutique ON order_items(boutique_id);", "CREATE INDEX idx_order_items_order ON order_items(order_id);"]
  }
];

export const API_SPEC_DATA: APIEndpoint[] = [
  {
    method: 'POST',
    path: '/api/v1/auth/register',
    description: "New customer or boutique owner registration via high-security Bcrypt hashing.",
    headers: ["Content-Type: application/json"],
    requestPayload: `{\n  "email": "boutique.lucknow@gmail.com",\n  "password": "Password123!",\n  "role": "designer"\n}`,
    responsePayload: `{\n  "success": true,\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",\n  "user": { "id": "u-819", "role": "designer" }\n}`
  },
  {
    method: 'POST',
    path: '/api/v1/boutiques/register',
    description: "Merchant KYC initialization containing GSTIN and encrypted Bank details.",
    headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
    requestPayload: `{\n  "brand_name": "Lucknowi Chiffons",\n  "city": "Lucknow",\n  "gstin": "09AAAAA1111A1Z1",\n  "pan_card": "AAAAA1111A",\n  "bank_account_number": "1234567890",\n  "bank_ifsc": "SBIN0000123"\n}`,
    responsePayload: `{\n  "success": true,\n  "boutique_id": "bt-294",\n  "kyc_status": "pending_admin_approval"\n}`
  },
  {
    method: 'POST',
    path: '/api/v1/products/create',
    description: "Designer dress catalog addition with asset pointers.",
    headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
    requestPayload: `{\n  "title": "Zardozi Scarlet Lehenga",\n  "category": "Lehenga",\n  "price_inr": 65000,\n  "fabric": "Silk Brocade",\n  "sizes": ["M", "L"],\n  "colors": ["Crimson", "Gold"],\n  "images": ["https://s3.ap-south-1.amazonaws.com/zari-products/sc_1.jpg"]\n}`,
    responsePayload: `{\n  "success": true,\n  "product_id": "dr-508",\n  "status": "pending_review"\n}`
  },
  {
    method: 'POST',
    path: '/api/v1/orders/create',
    description: "Multi-vendor checkout compilation generating secure Razorpay orders.",
    headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
    requestPayload: `{\n  "cart": [\n    { "product_id": "dr-508", "size": "M", "qty": 1 }\n  ]\n}`,
    responsePayload: `{\n  "success": true,\n  "order_id": "or-2900",\n  "total_amount": 65000,\n  "razorpay_order_id": "order_OkY78s7d8s",\n  "payment_callback_url": "/api/v1/payments/webhook"\n}`
  },
  {
    method: 'POST',
    path: '/api/v1/payments/split-settle',
    description: "Razorpay Route implementation splitting funds from unified capture directly to bank accounts after deducting commission.",
    headers: ["Content-Type: application/json", "Authorization: Bearer <token>"],
    requestPayload: `{\n  "razorpay_payment_id": "pay_98a7sd89a",\n  "order_id": "or-2900"\n}`,
    responsePayload: `{\n  "status": "settled",\n  "transfers": [\n    { "merchant": "bt-294", "amount_settled": 57200, "commission_collected": 7800 }\n  ]\n}`
  }
];

export const FOLDER_TREE_FRONTEND = `
zari-nextjs-app/
├── app/
│   ├── api/
│   │   └── gemini/
│   │       └── route.ts         # Server-side designer co-pilot
│   ├── globals.css              # Custom vermilion-gold design rules
│   ├── layout.tsx               # Primary Google Fonts wrapper
│   └── page.tsx                 # Core UI dashboard coordinating views
├── components/
│   ├── ui/                      # Optimized micro elements
│   ├── specs-hub.tsx            # Technical document renderer
│   └── demo-portal.tsx          # 3-Panel interactive sandbox portal
├── hooks/
│   └── use-mobile.ts            # Adaptive layouts
├── lib/
│   └── utils.ts                 # Class merger configs
├── public/
│   └── favicon.ico              
├── metadata.json                # Major capabilities configurations
└── package.json                 # Core dependencies mapping
`;

export const FOLDER_TREE_BACKEND = `
zari-rails-api/
├── app/
│   ├── controllers/
│   │   ├── api/v1/
│   │   │   ├── auth_controller.rb       # Devise JWT logins
│   │   │   ├── boutiques_controller.rb  # GSTIN KYC
│   │   │   ├── products_controller.rb   # Inventory manager
│   │   │   ├── orders_controller.rb     # Multi-vendor carts
│   │   │   ├── payments_controller.rb   # Razorpay Multi-split Hooks
│   │   │   └── logistics_controller.rb  # Shiprocket AWB hooks
│   ├── models/
│   │   ├── user.rb                      # Enforces validation
│   │   ├── boutique.rb                  # Encrypted credentials
│   │   ├── dress_item.rb                # Catalog details
│   │   ├── order.rb                     
│   │   ├── order_item.rb                # Fulfillment states
│   │   └── audit_log.rb                 # Non-repudiation logging
│   └── services/
│       ├── razorpay_split_service.rb    # Split API calculations
│       └── shiprocket_api_service.rb    # Automated label booker
├── config/
│   ├── routes.rb                        # Secured route mapping
│   └── sidekiq.yml                      # Thread-based work pools
├── db/
│   ├── schema.rb                        # Active Record schema
│   └── migrate/                         # Non-destructive seeds
└── spec/                                # RSpec test coverage
    ├── controllers/
    └── models/
`;

export const ROADMAP_12W = [
  { week: "W1-W2", title: "Architecture & Auth", desc: "Provision PostgreSQL schemas. Configure Rails Devise + JWT security tokens. Establish private AWS S3 repositories with server-side KMS keys. Design wireframes." },
  { week: "W3-W4", title: "KYC & Listings", desc: "Build merchant registration, boutique portals, and bulk upload hooks. Integrate Gemini API server description engines for designer inventory creation." },
  { week: "W5-W6", title: "Razorpay Checkout", desc: "Develop customer portal cart logic. Design Razorpay gateway API. program split-settlement webhooks allocating boutique revenues instantly." },
  { week: "W7-W8", title: "Fulfillment Sync", desc: "Integrate Shiprocket APIs. Connect boutique post-purchase routing. Setup automated shipping notifications (SMS and Email loops)." },
  { week: "W9-W10", title: "Moderation & Audits", desc: "Deploy administrative dispute consoles, refund approvals, and product moderation states. Build secure two-factor TOTP authentications." },
  { week: "W11-W12", title: "Testing & AWS Scaling", desc: "Execute load testing using JMeter. Setup Sentry error catcher. Standardize auto-scaling rules on ECS Fargate under CloudFront CDN." }
];

export const COST_DATA = {
  mvp: [
    { item: "AWS ECS Fargate (2x Micro Nodes)", cost: "$30" },
    { item: "AWS RDS Aurora Serverless (Postgres)", cost: "$40" },
    { item: "Amazon ElastiCache Redis (Micro)", cost: "$15" },
    { item: "S3, CloudFront & KMS Secret Storage", cost: "$10" },
    { item: "Razorpay Split Gateway Setup", cost: "Free (Pay per txn)" },
    { item: "Sentry / CloudWatch Metrics Layer", cost: "Free/Tiers" },
    { total: "$95" }
  ],
  scale: [
    { item: "AWS ECS Fargate (10x Medium Auto-Scale)", cost: "$450" },
    { item: "AWS RDS PostgreSQL (Multi-AZ High Availability + Read Replicas)", cost: "$350" },
    { item: "AWS DynamoDB (Telemetry & Auditing trails)", cost: "$120" },
    { item: "AWS ElastiCache Redis (2 Nodes cluster)", cost: "$110" },
    { item: "CloudFront CDN Gateway Shield + AWS WAF", cost: "$190" },
    { item: "Sentry Pro, Data Dog Observability Layers", cost: "$250" },
    { total: "$1,470" }
  ]
};
