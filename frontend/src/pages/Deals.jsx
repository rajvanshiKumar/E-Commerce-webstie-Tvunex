import { useEffect } from 'react';
import DealBanner from '../components/deals/DealBanner';
import ProductSection from '../components/product/ProductSection';
import useProducts from '../hooks/useProducts';

export default function Deals() {
  const { products, loading } = useProducts({ collection: 'deals' });

  useEffect(() => {
    document.title = 'Deals — PRAHARX';
  }, []);

  return (
    <>
      <h1 className="sr-only">Deals</h1>
      <DealBanner showCta={false} />
      <ProductSection
        id="deals"
        eyebrow="30% off or more"
        title="Today’s deals"
        subtitle="The biggest price drops across the store, highest discount first."
        products={products}
        loading={loading}
        skeletonCount={12}
      />
    </>
  );
}
