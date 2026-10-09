import { motion } from 'framer-motion';
import { BadgeCheck, RotateCcw, ShieldCheck, Truck } from 'lucide-react';

const FEATURES = [
  { icon: Truck, title: 'Fast Delivery', description: 'Dispatched within 24 hours, with free delivery on orders over ₹999.' },
  { icon: ShieldCheck, title: 'Secure Payment', description: 'Encrypted checkout with cards, UPI, net banking and wallets.' },
  { icon: RotateCcw, title: 'Easy Returns', description: 'Changed your mind? Send it back within 7 days, no questions asked.' },
  { icon: BadgeCheck, title: 'Quality Products', description: 'Every product is checked by our team before it reaches the shelf.' },
];

export default function WhyPraharX() {
  return (
    <section aria-labelledby="why-title" className="py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -80px 0px' }}
          transition={{ duration: 0.5 }}
          className="mb-8 max-w-xl sm:mb-10"
        >
          <p className="eyebrow">The PraharX promise</p>
          <h2 id="why-title" className="display mt-3 text-2xl text-white sm:text-3xl lg:text-4xl">
            Why PraharX
          </h2>
        </motion.header>

        <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -60px 0px' }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -6 }}
              className="glass group relative overflow-hidden rounded-3xl p-6 transition-colors duration-300 hover:border-volt/40 sm:p-7"
            >
              <span aria-hidden="true" className="absolute -top-10 -right-10 size-32 rounded-full bg-volt/0 blur-2xl transition-colors duration-500 group-hover:bg-volt/20" />
              <span className="relative flex size-12 items-center justify-center rounded-2xl bg-white/5 text-volt transition-all duration-300 group-hover:bg-volt group-hover:text-ink-950">
                <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <h3 className="relative mt-6 font-display text-sm font-semibold tracking-tight text-white uppercase">{title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-mist">{description}</p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
