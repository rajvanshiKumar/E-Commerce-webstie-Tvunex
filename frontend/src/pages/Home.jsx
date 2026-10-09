import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import { subscribeToNewsletter } from '../api/mockApi';
import CategorySection from '../components/category/CategorySection';
import FeaturedCollection from '../components/collection/FeaturedCollection';
import Button from '../components/common/Button';
import { toast } from '../components/common/Toast';
import DealBanner from '../components/deals/DealBanner';
import HeroBanner from '../components/hero/HeroBanner';
import ProductSection from '../components/product/ProductSection';
import Reviews from '../components/review/Reviews';
import WhyPraharX from '../components/whyPraharx/WhyPraharX';
import useProducts from '../hooks/useProducts';
import { validateEmail } from '../utils/validators';

const MARQUEE_ITEMS = ['Free delivery over ₹999', '7-day easy returns', 'Secure checkout', 'New drops every week', '80+ curated products'];

function Marquee() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div aria-hidden="true" className="overflow-hidden border-y bg-ink-900/60 py-4">
      <div className="marquee flex w-max gap-10 pr-10">
        {[...items, ...items].map((item, index) => (
          <span key={index} className="flex items-center gap-10 font-display text-xs font-semibold tracking-[0.2em] whitespace-nowrap text-zinc-400 uppercase">
            {item}
            <span className="size-1.5 rounded-full bg-volt" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    setSubmitting(true);
    try {
      await subscribeToNewsletter(email);
      toast.success('You are subscribed. Welcome to the list.');
      setEmail('');
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section aria-labelledby="newsletter-title" className="py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12 sm:py-16"
        >
          <div aria-hidden="true" className="pointer-events-none absolute -top-32 left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-volt/15 blur-[110px]" />

          <div className="relative mx-auto max-w-2xl">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-volt text-ink-950">
              <Mail className="size-6" aria-hidden="true" />
            </span>
            <h2 id="newsletter-title" className="display mt-6 text-2xl text-balance text-white sm:text-4xl">
              Stay Ahead of the Trends
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-mist">
              Subscribe to receive exclusive offers, new arrivals and updates.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mx-auto mt-8 max-w-lg">
              <div className="flex flex-col gap-3 sm:flex-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-invalid={error ? 'true' : 'false'}
                  aria-describedby={error ? 'newsletter-email-error' : undefined}
                  className="field h-13 shrink-0 rounded-full px-6 py-0 sm:flex-1"
                />
                <Button type="submit" size="lg" loading={submitting}>
                  Subscribe
                </Button>
              </div>
              {error && (
                <p id="newsletter-email-error" role="alert" className="mt-3 text-sm font-semibold text-ember">
                  {error}
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const featured = useProducts({ collection: 'featured', limit: 8 });
  const trending = useProducts({ collection: 'trending' });
  const newArrivals = useProducts({ collection: 'new', limit: 8 });

  // Section order is fixed by the product brief (Navbar and Footer come from Layout).
  return (
    <>
      <HeroBanner />
      <Marquee />
      <CategorySection />
      <ProductSection
        id="featured"
        eyebrow="Editor’s picks"
        title="Best of PraharX"
        subtitle="The products our customers keep coming back for."
        products={featured.products}
        loading={featured.loading}
        viewAllTo="/shop"
        viewAllLabel="Shop all"
      />
      <ProductSection
        id="trending"
        eyebrow="Popular right now"
        title="Trending now"
        products={trending.products}
        loading={trending.loading}
        layout="carousel"
        viewAllTo="/shop"
      />
      <ProductSection
        id="new-arrivals"
        eyebrow="Just landed"
        title="New arrivals"
        products={newArrivals.products}
        loading={newArrivals.loading}
        viewAllTo="/new-arrivals"
      />
      <DealBanner />
      <FeaturedCollection />
      <WhyPraharX />
      <Reviews />
      <Newsletter />
    </>
  );
}
