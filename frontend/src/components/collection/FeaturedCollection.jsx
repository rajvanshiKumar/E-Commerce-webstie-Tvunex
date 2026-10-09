import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { siteImages } from '../../data/images';
import { imageProps } from '../../utils/imageFallback';
import Button from '../common/Button';

const photo = siteImages.featuredCollection;

export default function FeaturedCollection() {
  return (
    <section aria-labelledby="collection-title" className="py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="group relative flex min-h-[28rem] items-end overflow-hidden rounded-[2rem] border sm:min-h-[34rem] lg:items-center"
        >
          <img
            {...imageProps(photo.src, photo.remote)}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-105"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent lg:bg-gradient-to-r lg:from-ink-950 lg:via-ink-950/70" />

          <div className="relative max-w-xl p-6 sm:p-12 lg:p-16">
            <p className="eyebrow">Featured collection</p>
            <h2 id="collection-title" className="display mt-4 text-3xl text-white sm:text-5xl">
              The Studio Edit
            </h2>
            <p className="mt-4 text-base text-zinc-300 sm:text-lg">
              Explore our latest collection. Sharp tailoring, soft knits and everyday carry, chosen to work together.
            </p>
            <Button to="/shop/fashion" size="lg" variant="light" className="mt-8">
              Explore now
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
