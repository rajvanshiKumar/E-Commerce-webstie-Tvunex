import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductGrid from '../components/product/ProductGrid';
import EmptyState from '../components/common/EmptyState';
import useProducts from '../hooks/useProducts';

export default function NewArrivals() {
  const { products, loading } = useProducts({ collection: 'new' });

  useEffect(() => {
    document.title = 'New Arrivals — PRAHARX';
  }, []);

  return (
    <>
      <header className="relative overflow-hidden border-b">
        <div aria-hidden="true" className="pointer-events-none absolute -top-40 right-0 size-[32rem] rounded-full bg-volt/10 blur-[120px]" />
        <div className="shell relative py-10 sm:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-xs font-semibold text-mist">
              <li>
                <Link to="/" className="transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="text-white">
                New Arrivals
              </li>
            </ol>
          </nav>
          <p className="eyebrow mt-6">Just landed</p>
          <h1 className="display mt-3 text-3xl text-white sm:text-5xl">New arrivals</h1>
          <p className="mt-3 max-w-xl text-sm text-mist sm:text-base">Fresh additions from every department, updated weekly.</p>
        </div>
      </header>

      <div className="shell py-8 sm:py-10">
        {!loading && products.length === 0 ? (
          <EmptyState title="No products found" description="New products are on the way. Check back soon." />
        ) : (
          <ProductGrid products={products} loading={loading} skeletonCount={12} />
        )}
      </div>
    </>
  );
}
