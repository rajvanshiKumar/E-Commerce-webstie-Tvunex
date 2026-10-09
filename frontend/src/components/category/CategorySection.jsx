import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getCategories } from '../../api/categoryApi';
import CategoryCard from './CategoryCard';

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getCategories().then((data) => {
      if (!active) return;
      setCategories(data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="categories" aria-labelledby="categories-title" className="scroll-mt-24 py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.5 }}
          className="mb-8 max-w-xl sm:mb-10"
        >
          <p className="eyebrow">Browse</p>
          <h2 id="categories-title" className="display mt-3 text-2xl text-white sm:text-3xl lg:text-4xl">
            Shop by category
          </h2>
          <p className="mt-3 text-sm text-mist sm:text-base">Eight departments, one consistent standard.</p>
        </motion.header>

        <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }, (_, index) => (
                <li key={index} aria-hidden="true" className="shimmer aspect-[4/5] rounded-2xl sm:rounded-3xl" />
              ))
            : categories.map((category, index) => (
                <motion.li
                  key={category.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '0px 0px -60px 0px' }}
                  transition={{ duration: 0.45, delay: (index % 4) * 0.07 }}
                >
                  <CategoryCard category={category} />
                </motion.li>
              ))}
        </ul>
      </div>
    </section>
  );
}
