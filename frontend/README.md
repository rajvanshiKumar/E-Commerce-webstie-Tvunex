# PRAHARX — Premium E-Commerce Frontend

PRAHARX is a complete, frontend-only e-commerce storefront: a dark, glassmorphic UI with a hero carousel, eight product categories, filtering, sorting, search, quick view, cart, wishlist and login/signup. There is **no backend and no database**. All data comes from local JavaScript files through a mock API layer, and state is kept with React Context and `localStorage`.

## Technology stack

| Area | Choice |
| --- | --- |
| UI library | React 19 (JavaScript, no TypeScript) |
| Build tool | Vite |
| Routing | React Router |
| Styling | Tailwind CSS v4 (via the `@tailwindcss/vite` plugin — no `tailwind.config.js` needed; design tokens live in `src/styles/index.css`) |
| Animation | Framer Motion |
| Icons | Lucide React |
| State | React Context API + `localStorage` |
| Fonts | Unbounded (display) and Manrope (text), loaded from Google Fonts in `index.html` |

## Installation

Requires Node.js 20 or newer.

```bash
cd frontend
npm install
npm run images   # downloads the 93 site photos into public/images/
```

`npm run images` is optional but recommended. Until it has been run, the site loads each photo straight from the Unsplash CDN instead of from local files.

`npm install` also creates `package-lock.json`. Commit that file so everyone installs the same versions.

## Run

```bash
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build into dist/
npm run preview   # serve the production build locally
npm run images    # download any missing photos (add `-- --force` to re-download all)
npm run images:check   # verify the local photo files without using the network
```

The app uses `BrowserRouter`, so when you deploy it, configure your host to serve `index.html` for unknown paths (a "single-page app fallback").

## Demo account

| Email | Password |
| --- | --- |
| `demo@praharx.com` | `demo1234` |

You can also create your own account on `/signup`.

## Folder structure

```
frontend/
├── public/
│   ├── images/            banners/ products/ categories/ collections/ avatars/ fallback.svg
│   └── favicon.ico
├── src/
│   ├── assets/            icons/ (logo mark), images/
│   ├── components/
│   │   ├── layout/        Navbar, Footer, Layout
│   │   ├── hero/          HeroBanner, HeroSkeleton
│   │   ├── category/      CategorySection, CategoryCard
│   │   ├── product/       ProductSection, ProductGrid, ProductCard, ProductSkeleton,
│   │   │                  ProductCarousel, QuickView, FilterSidebar, SortDropdown
│   │   ├── search/        SearchOverlay
│   │   ├── cart/          CartDrawer, CartItem, CartSummary
│   │   ├── wishlist/      WishlistDrawer, WishlistItem
│   │   ├── auth/          ProtectedRoute, AuthForm
│   │   ├── deals/         DealBanner
│   │   ├── collection/    FeaturedCollection
│   │   ├── review/        Reviews, ReviewCard
│   │   ├── common/        Button, Loader, EmptyState, Modal, Toast
│   │   └── whyPraharx/    WhyPraharX
│   ├── pages/             Home, Shop, ProductDetails, Login, Signup, Account,
│   │                      Wishlist, Cart, Deals, NewArrivals, NotFound
│   ├── context/           AuthContext, CartContext, WishlistContext
│   ├── api/               authApi, productApi, categoryApi, mockApi
│   ├── data/              products, categories, banners, reviews, users, images (photo manifest helpers)
│   ├── hooks/             useAuth, useCart, useWishlist, useProducts, useDebounce
│   ├── utils/             localStorage, formatPrice, filterProducts, sortProducts, validators, imageFallback
│   ├── routes/            AppRoutes
│   ├── styles/            index.css (Tailwind + tokens), animations.css
│   ├── App.jsx
│   └── main.jsx
├── scripts/
│   └── download-images.mjs   photo downloader / checker (no dependencies)
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

A few notes on where shared pieces live, since the structure is fixed:

- `Modal.jsx` is the single overlay primitive. Its `position` prop turns it into a centred dialog (Quick View), a right drawer (cart, wishlist), a left drawer (mobile menu, filters) or a top sheet (search).
- `Toast.jsx` exports both the `<Toast />` container (mounted once in `Layout`) and a `toast` helper, so any module can call `toast.success('…')`.
- The star `Rating` component is exported from `ReviewCard.jsx` and reused by product cards, Quick View and the product page.
- The home page newsletter section lives in `Home.jsx`; the compact footer form lives in `Footer.jsx`.

## Features

- Sticky glassmorphic navbar with active-link indicator, category menu, account menu and a mobile drawer
- Hero carousel: auto-slide, previous/next, pagination dots with progress, pause on hover, pointer parallax, skeleton while loading
- 8 clickable categories with live product counts
- **One reusable `Shop.jsx`** for `/shop` and every `/shop/:category` — the UI is identical, only the data changes
- 80 products (10 per category), all defined in `src/data/products.js`
- Filters (category, price, brand, rating, discount, availability) — sidebar on desktop, drawer on mobile
- Sorting (featured, price, rating, newest, popular)
- Search overlay with debounced queries, popular searches and recent searches
- Quick View dialog with variants and quantity
- Cart drawer and cart page: add, remove, change quantity, clear, subtotal, discount, delivery and total
- Wishlist drawer and wishlist page
- Trending carousel, new arrivals, limited-time deal banner with a real countdown (to local midnight)
- Featured collection, Why PraharX, customer review carousel, newsletter with validation
- Login, signup, logout and protected routes (`/account`, `/wishlist`, `/cart`)
- Skeleton/shimmer loading states, empty states, toasts and a 404 page
- Responsive grid: 4 / 3 / 2 product columns on desktop / tablet / mobile
- Accessibility: semantic landmarks, labelled controls, keyboard-operable dialogs (Escape to close, focus returned to the trigger), visible focus rings, `prefers-reduced-motion` support

### Routes

| Path | Page | Login required |
| --- | --- | --- |
| `/` | Home | |
| `/shop`, `/shop/:category` | Shop | |
| `/shop?q=term` | Shop (search results) | |
| `/product/:id` | ProductDetails | |
| `/new-arrivals` | NewArrivals | |
| `/deals` | Deals | |
| `/login`, `/signup` | Login, Signup | |
| `/account`, `/wishlist`, `/cart` | Account, Wishlist, Cart | Yes |
| `*` | NotFound | |

Category slugs: `fashion`, `shoes`, `electronics`, `mobiles`, `home`, `beauty`, `gaming`, `bags`.

## Authentication (frontend only)

Authentication is a **demo of the flow, not real security**.

- `authApi.js` stores accounts in `localStorage` under `users` and the active session under `currentUser`.
- Signup validates required fields, email format, a minimum password length of 8, password confirmation and duplicate emails.
- Login checks the email and password against the stored users. The session object never includes the password.
- `AuthContext` restores the session on load, so a refresh keeps you logged in.
- `ProtectedRoute` redirects logged-out visitors to `/login` and returns them to the page they wanted after login.
- Logout removes `currentUser`, returns to Home and shows a toast. The cart and wishlist are kept.

Passwords are stored in plain text in the browser because there is no server. Never ship this to production — replace `authApi.js` with calls to a real authentication service.

## localStorage

| Key | Contents |
| --- | --- |
| `users` | Registered accounts (seeded from `src/data/users.js`) |
| `currentUser` | The logged-in user (no password) |
| `praharx_cart` | Cart lines |
| `praharx_wishlist` | Wishlist products |
| `praharx_recent_searches` | Last six searches |
| `praharx_newsletter` | Subscribed emails |

All access goes through `src/utils/localStorage.js`, which fails safely if storage is blocked. To reset the app, clear site data in your browser's dev tools.

## Mock API

Components do not import product, category, banner, review or user data directly. They call functions in `src/api/`, which behave like a network client:

```
User → React Router → Page → Component → Mock API → Local data → State / Context → UI
```

- `mockApi.js` — `mockRequest()` adds an artificial delay and returns a deep copy of the data (like a real response). Also `getBanners()`, `getReviews()`, `subscribeToNewsletter()`.
- `productApi.js` — `getProducts()`, `getProductsByCategory(category)`, `getProductById(id)`, `getFeaturedProducts()`, `getTrendingProducts()`, `getNewArrivals()`, `getDeals()`, `getRelatedProducts(id)`, `searchProducts(query)`.
- `categoryApi.js` — `getCategories()`, `getCategoryBySlug(slug)`.
- `authApi.js` — `registerUser(user)`, `loginUser(email, password)`, `logoutUser()`, `getCurrentUser()`.

The delay is what makes the skeleton loaders visible. Change `NETWORK_DELAY` in `mockApi.js` to adjust it.

## Future backend integration

Because every data access already goes through `src/api/`, moving to a real backend means changing only those files:

1. Replace each function body with a `fetch` call, for example:
   ```js
   export async function getProductsByCategory(category) {
     const response = await fetch(`${import.meta.env.VITE_API_URL}/products?category=${category}`);
     if (!response.ok) throw new ApiError('Could not load products.', response.status);
     return response.json();
   }
   ```
2. Keep the same function names and return shapes, and pages, hooks and components need no changes.
3. Replace `authApi.js` with real endpoints and store a token (ideally an HTTP-only cookie) instead of the user list.
4. Move cart and wishlist persistence from `localStorage` to the server inside `CartContext` and `WishlistContext` if you want them to follow the user across devices.
5. Connect the Checkout button (currently a demo toast) to a payment provider.

## Images

All photography comes from [Unsplash](https://unsplash.com/license) under its free licence: 80 product photos (one per product), 8 category photos, 3 hero banners and 2 collection photos. Review avatars are generated initials, not photos of real people.

### How it fits together

- **Manifest.** Each photo is declared once in `src/data/`: the last value of every row in `products.js`, the rows in `categories.js`, the `photo(...)` calls in `banners.js`, and `siteImages` in `images.js`. An entry holds the Unsplash photo ID, the local file name and the alt text.
- **Local files.** `npm run images` downloads every photo, cropped to the right size, into `public/images/` with descriptive names such as `products/shoes-premium-sneakers.jpg`. It validates each file (HTTP status, JPEG format, dimensions), lists anything that failed, and exits with an error code if there are failures.
- **Fallback chain.** `src/utils/imageFallback.js` gives every `<img>` three steps: the local file, then the same photo on the Unsplash CDN, then a neutral placeholder (`public/images/fallback.svg`). A missing or broken image never shows as a broken icon.

### Sizes

| Kind | Size | Shown as |
| --- | --- | --- |
| Product | 1000 × 1000 | square, `object-cover` |
| Category | 800 × 1000 | 4:5 portrait card |
| Hero banner | 1920 × 1080 | full-bleed background behind the headline, with gradient overlays for contrast |
| Collection | 1920 × 1080 | wide banner |
| Login / signup panel | 1000 × 1300 | portrait |

The hero image is loaded eagerly with `fetchPriority="high"`; everything below the fold uses `loading="lazy"`.

### Changing a photo

Replace the `photo-…` ID in the relevant data file with the ID of another Unsplash photo (it is the `photo-…` part of the image address on the photo's page), then run `npm run images`. To use your own photography instead, drop a JPEG with the same file name into `public/images/`.

Some stock photos show real-world brand names on the products. Swap those for your own product photography before using the site commercially.
