import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronRight, Heart, Minus, PackageX, Plus, RotateCcw, ShieldCheck, ShoppingBag, Truck, ZoomIn } from 'lucide-react';
import { getProductById } from '../api/productApi';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ProductSection from '../components/product/ProductSection';
import { Rating } from '../components/review/ReviewCard';
import Reviews from '../components/review/Reviews';
import useCart from '../hooks/useCart';
import useProducts from '../hooks/useProducts';
import useWishlist from '../hooks/useWishlist';
import formatPrice from '../utils/formatPrice';
import { imageProps } from '../utils/imageFallback';

const PERKS = [
  { icon: Truck, text: 'Free delivery over ₹999' },
  { icon: RotateCcw, text: '7-day easy returns' },
  { icon: ShieldCheck, text: 'Secure checkout' },
];

function DetailsSkeleton() {
  return (
    <div className="shell grid gap-8 py-8 lg:grid-cols-2 lg:gap-14 lg:py-12" role="status" aria-label="Loading product">
      <div className="shimmer aspect-square w-full rounded-[2rem]" />
      <div className="space-y-5 py-4">
        <div className="shimmer h-3 w-32 rounded-full" />
        <div className="shimmer h-10 w-4/5 rounded-2xl" />
        <div className="shimmer h-4 w-48 rounded-full" />
        <div className="shimmer h-10 w-56 rounded-2xl" />
        <div className="shimmer h-24 w-full rounded-2xl" />
        <div className="shimmer h-12 w-64 rounded-full" />
        <div className="shimmer h-13 w-full rounded-full" />
      </div>
    </div>
  );
}

/** One page for every product: the data is loaded from /product/:id. */
export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart, openCart, maxQuantity } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | missing
  const [activeImage, setActiveImage] = useState(0);
  const [variant, setVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [zoomOrigin, setZoomOrigin] = useState(null); // CSS transform-origin while hovering

  const related = useProducts({ relatedTo: id });

  useEffect(() => {
    let active = true;
    setStatus('loading');
    getProductById(id)
      .then((data) => {
        if (!active) return;
        setProduct(data);
        setVariant(data.variants?.[0] ?? null);
        setQuantity(1);
        setActiveImage(0);
        setStatus('ready');
        document.title = `${data.name} — PRAHARX`;
      })
      .catch(() => {
        if (active) setStatus('missing');
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (status === 'loading') return <DetailsSkeleton />;

  if (status === 'missing' || !product) {
    return (
      <div className="shell">
        <EmptyState
          icon={PackageX}
          title="Product not found"
          description="This product may have been removed, or the link is incorrect."
          action={<Button to="/shop">Back to shop</Button>}
        />
      </div>
    );
  }

  const wished = isInWishlist(product.id);
  const photo = product.images[activeImage] ?? product.images[0];

  // Desktop hover zoom: the image scales up around the pointer position.
  const handleZoomMove = (event) => {
    if (event.pointerType !== 'mouse') return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    setZoomOrigin(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, variant);
    openCart();
  };

  return (
    <>
      <div className="shell py-6 lg:py-10">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-mist">
            <li>
              <Link to="/" className="transition-colors hover:text-white">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link to={`/shop/${product.category}`} className="capitalize transition-colors hover:text-white">
                {product.category}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li aria-current="page" className="max-w-[14rem] truncate text-white">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Product images */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div
              className="group/zoom relative aspect-square cursor-zoom-in overflow-hidden rounded-[2rem] border bg-ink-800"
              onPointerMove={handleZoomMove}
              onPointerLeave={() => setZoomOrigin(null)}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={photo.src}
                  {...imageProps(photo.src, photo.remote)}
                  alt={product.images.length > 1 ? `${photo.alt} — view ${activeImage + 1}` : photo.alt}
                  width={photo.width}
                  height={photo.height}
                  fetchPriority="high"
                  decoding="async"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{ transformOrigin: zoomOrigin ?? 'center' }}
                  className={`absolute inset-0 size-full object-cover transition-transform duration-300 ease-out ${
                    zoomOrigin ? 'scale-[1.8]' : 'scale-100'
                  }`}
                />
              </AnimatePresence>
              <div className="pointer-events-none absolute top-4 left-4 flex flex-col items-start gap-2">
                {product.discount > 0 && (
                  <span className="rounded-full bg-ember px-3 py-1 text-[0.6875rem] font-extrabold tracking-wider text-white uppercase">
                    {product.discount}% off
                  </span>
                )}
                {product.isNew && (
                  <span className="rounded-full bg-white px-3 py-1 text-[0.6875rem] font-extrabold tracking-wider text-ink-950 uppercase">
                    New
                  </span>
                )}
              </div>
              <span className="glass pointer-events-none absolute right-4 bottom-4 hidden items-center gap-2 rounded-full bg-ink-950/60 px-3 py-1.5 text-[0.625rem] font-bold tracking-[0.18em] text-white uppercase transition-opacity group-hover/zoom:opacity-0 lg:flex">
                <ZoomIn className="size-3.5" aria-hidden="true" /> Hover to zoom
              </span>
            </div>

            {product.images.length > 1 && (
              <ul className="mt-3 flex gap-3" aria-label="Product images">
                {product.images.map((image, index) => (
                  <li key={image.src}>
                    <button
                      type="button"
                      onClick={() => setActiveImage(index)}
                      aria-label={`Show image ${index + 1}`}
                      aria-current={index === activeImage ? 'true' : undefined}
                      className={`block size-20 overflow-hidden rounded-2xl border-2 transition-colors ${
                        index === activeImage ? 'border-volt' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img {...imageProps(image.src, image.remote)} alt="" loading="lazy" decoding="async" className="size-full object-cover" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Product information */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="eyebrow">
              {product.brand} · {product.category}
            </p>
            <h1 className="mt-4 font-display text-2xl leading-tight font-bold text-white sm:text-4xl">{product.name}</h1>

            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <span className="text-4xl font-extrabold text-white">{formatPrice(product.price)}</span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg text-mist line-through">
                    <span className="sr-only">Original price </span>
                    {formatPrice(product.originalPrice)}
                  </span>
                  <span className="rounded-full bg-volt/10 px-3 py-1 text-xs font-bold text-volt">
                    Save {formatPrice(product.originalPrice - product.price)}
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-mist">Inclusive of all taxes</p>

            <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-mist">
              <Rating value={product.rating} size={16} />
              <span className="font-bold text-white">{product.rating.toFixed(1)}</span>
              <a href="#reviews" className="underline underline-offset-4 transition-colors hover:text-white">
                {product.reviews.toLocaleString('en-IN')} reviews
              </a>
              <span aria-hidden="true">·</span>
              {product.inStock ? (
                <span className="font-semibold text-volt">In stock{product.stock <= 10 ? ` — only ${product.stock} left` : ''}</span>
              ) : (
                <span className="font-semibold text-ember">Out of stock</span>
              )}
            </div>

            {product.variants?.length > 0 && (
              <fieldset className="mt-8">
                <legend className="text-[0.6875rem] font-bold tracking-[0.2em] text-mist uppercase">
                  {product.variantLabel}: <span className="text-white">{variant}</span>
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setVariant(option)}
                      aria-pressed={variant === option}
                      className={`min-w-12 rounded-full border px-5 py-2.5 text-sm font-bold transition-colors ${
                        variant === option
                          ? 'border-volt bg-volt text-ink-950'
                          : 'border-white/15 text-white hover:border-white/50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="mt-8">
              <p id="quantity-label" className="text-[0.6875rem] font-bold tracking-[0.2em] text-mist uppercase">
                Quantity
              </p>
              <div role="group" aria-labelledby="quantity-label" className="mt-3 inline-flex items-center rounded-full border border-white/15">
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="flex size-12 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <span className="w-10 text-center text-base font-bold text-white" aria-live="polite">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                  disabled={quantity >= maxQuantity}
                  aria-label="Increase quantity"
                  className="flex size-12 items-center justify-center rounded-full text-white transition hover:bg-white/10 disabled:opacity-30"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <Button onClick={handleAddToCart} disabled={!product.inStock} size="lg" className="flex-1">
                <ShoppingBag className="size-4" aria-hidden="true" />
                {product.inStock ? 'Add to cart' : 'Sold out'}
              </Button>
              <motion.button
                type="button"
                onClick={() => toggleWishlist(product)}
                whileTap={{ scale: 0.85 }}
                aria-pressed={wished}
                aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                className={`flex size-13 shrink-0 items-center justify-center rounded-full border transition-colors ${
                  wished ? 'border-ember bg-ember/10 text-ember' : 'border-white/20 text-white hover:border-ember hover:text-ember'
                }`}
              >
                <Heart className={`size-5 ${wished ? 'fill-current' : ''}`} aria-hidden="true" />
              </motion.button>
            </div>

            <ul className="mt-8 grid gap-2 sm:grid-cols-3">
              {PERKS.map(({ icon: Icon, text }) => (
                <li key={text} className="glass flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-semibold text-zinc-200">
                  <Icon className="size-4 shrink-0 text-volt" aria-hidden="true" />
                  {text}
                </li>
              ))}
            </ul>

            <section aria-labelledby="description-title" className="mt-10 border-t pt-8">
              <h2 id="description-title" className="font-display text-sm font-semibold tracking-tight text-white uppercase">
                Description
              </h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-mist">{product.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <dt className="text-mist">Brand</dt>
                  <dd className="font-semibold text-white">{product.brand}</dd>
                </div>
                <div>
                  <dt className="text-mist">Category</dt>
                  <dd className="font-semibold text-white capitalize">{product.category}</dd>
                </div>
                <div>
                  <dt className="text-mist">{product.variantLabel} options</dt>
                  <dd className="font-semibold text-white">{product.variants.join(', ')}</dd>
                </div>
                <div>
                  <dt className="text-mist">Product code</dt>
                  <dd className="font-semibold text-white">PX-{String(product.id).padStart(4, '0')}</dd>
                </div>
              </dl>
            </section>
          </motion.div>
        </div>
      </div>

      <div id="reviews" className="scroll-mt-24">
        <Reviews eyebrow="Reviews" title="What customers say" />
      </div>

      <ProductSection
        id="related"
        eyebrow="You may also like"
        title="Related products"
        products={related.products}
        loading={related.loading}
        layout="carousel"
        viewAllTo={`/shop/${product.category}`}
      />
    </>
  );
}
