# Twostones Modular Architecture Map

## Directory Structure

```
src/
├── layouts/              # Pure UI wrappers (no business logic)
│   ├── MainLayout.tsx    # Standard header + footer + content
│   └── components/
│       ├── Navbar.tsx
│       └── Footer.tsx
│
├── templates/            # Reusable page templates (data-agnostic)
│   └── LandingTemplate.tsx
│
├── features/             # Domain-specific modules (lazy-loaded)
│   ├── auth/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── pages/
│   │       ├── Login.tsx
│   │       └── Register.tsx
│   │
│   ├── cart/
│   │   ├── context/
│   │   │   └── CartContext.tsx
│   │   └── pages/
│   │       └── Cart.tsx
│   │
│   ├── stylist/
│   │   └── pages/
│   │       └── StylistPage.tsx
│   │
│   ├── manukato/
│   │   └── pages/
│   │       ├── ManukatoCollection.tsx
│   │       └── ManukatoProduct.tsx
│   │
│   ├── journal/
│   │   └── pages/
│   │       ├── JournalList.tsx
│   │       └── JournalExperience.tsx
│   │
│   └── shop/
│       └── pages/
│           └── Shop.tsx
│
├── pages/                # Standalone pages (not feature-specific)
│   ├── Home.tsx          # Uses LandingTemplate
│   ├── Profile.tsx
│   ├── Contact.tsx
│   ├── FAQ.tsx
│   ├── ShippingReturns.tsx
│   ├── SizeGuide.tsx
│   ├── AdminClients.tsx
│   ├── AdminOrders.tsx
│   └── AdminJournals.tsx
│
├── components/           # Shared UI components
│   ├── ProductCard.tsx
│   ├── ResponsiveImage.tsx
│   ├── LoadingSpinner.tsx
│   └── AdminLayout.tsx
│
├── services/             # API services
│   └── api.ts
│
├── AppProviders.tsx      # Global context providers wrapper
└── App.tsx               # Route definitions
```

## Page-to-Feature Mapping

| Route | Page Component | Feature Module | Layout | Lazy Loaded |
|:------|:--------------|:---------------|:-------|:------------|
| `/` | `Home.tsx` | - | MainLayout | ✓ |
| `/shop` | `Shop.tsx` | shop | MainLayout | ✓ |
| `/cart` | `Cart.tsx` | cart | MainLayout | ✓ |
| `/login` | `Login.tsx` | auth | MainLayout | ✓ |
| `/register` | `Register.tsx` | auth | MainLayout | ✓ |
| `/stylist` | `StylistPage.tsx` | stylist | MainLayout | ✓ |
| `/journal` | `JournalList.tsx` | journal | MainLayout | ✓ |
| `/journal/:id` | `JournalExperience.tsx` | journal | MainLayout | ✓ |
| `/collection/manukato` | `ManukatoCollection.tsx` | manukato | MainLayout | ✓ |
| `/collection/manukato/:id` | `ManukatoProduct.tsx` | manukato | MainLayout | ✓ |
| `/profile` | `Profile.tsx` | - | MainLayout | ✓ |
| `/contact` | `Contact.tsx` | - | MainLayout | ✓ |
| `/faq` | `FAQ.tsx` | - | MainLayout | ✓ |
| `/shipping` | `ShippingReturns.tsx` | - | MainLayout | ✓ |
| `/size-guide` | `SizeGuide.tsx` | - | MainLayout | ✓ |
| `/admin/*` | Admin pages | - | AdminLayout | ✓ |

## Global Contexts

- **AuthProvider**: Provides user authentication state across the app
- **CartProvider**: Provides shopping cart state across the app
- **QueryClientProvider**: React Query for data fetching

All contexts are initialized in `AppProviders.tsx` and wrap the entire application.

## Static Export Safety

All templates and pages are designed to handle missing data gracefully:
- Use optional chaining (`data?.field`)
- Provide fallback values (`data || []`)
- Show loading states or empty states when data is unavailable

This ensures pages can be exported as static HTML without runtime errors.
