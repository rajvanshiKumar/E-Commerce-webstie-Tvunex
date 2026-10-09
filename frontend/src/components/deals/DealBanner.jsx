import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import Button from '../common/Button';

// The sale ends at the next local midnight, so the countdown is real
// and survives a page refresh without needing any stored state.
function getDeadline() {
  const deadline = new Date();
  deadline.setHours(24, 0, 0, 0);
  return deadline.getTime();
}

function getTimeLeft(deadline) {
  const total = Math.max(0, deadline - Date.now());
  return {
    total,
    hours: Math.floor(total / 3_600_000),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

const pad = (value) => String(value).padStart(2, '0');

function TimeUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-ink-950 font-display text-2xl font-bold text-volt tabular-nums sm:h-24 sm:w-24 sm:text-4xl">
        {pad(value)}
      </span>
      <span className="mt-2 text-[0.625rem] font-bold tracking-[0.24em] text-ink-950/70 uppercase">{label}</span>
    </div>
  );
}

export default function DealBanner({ showCta = true }) {
  const [deadline, setDeadline] = useState(getDeadline);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(deadline));

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = getTimeLeft(deadline);
      if (next.total <= 0) setDeadline(getDeadline()); // roll over to the next day
      setTimeLeft(next);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [deadline]);

  return (
    <section aria-labelledby="deal-title" className="py-12 sm:py-16 lg:py-20">
      <div className="shell">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '0px 0px -100px 0px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-volt px-6 py-10 text-ink-950 sm:px-12 sm:py-14 lg:px-16 lg:py-16"
        >
          {/* Decorative rings + oversized percent sign */}
          <div aria-hidden="true" className="spin-slow pointer-events-none absolute -top-40 -right-40 size-[30rem] rounded-full border-[3rem] border-dashed border-ink-950/5" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-16 left-1/2 font-display text-[16rem] leading-none font-extrabold text-ink-950/[0.06] select-none lg:text-[22rem]">
            %
          </span>

          <div className="relative grid items-center gap-10 lg:grid-cols-[1.2fr_auto]">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2 text-[0.6875rem] font-bold tracking-[0.24em] text-volt uppercase">
                <Zap className="size-3.5 fill-current" aria-hidden="true" />
                Limited time offer
              </p>
              <h2 id="deal-title" className="display mt-6 text-4xl sm:text-6xl lg:text-7xl">
                Up to 50% off
              </h2>
              <p className="mt-4 max-w-md text-base font-medium text-ink-950/75">
                Today’s prices reset at midnight. Once the timer hits zero, they are gone.
              </p>
              {showCta && (
                <Button to="/deals" size="lg" variant="dark" className="mt-8">
                  Shop deals
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              )}
            </div>

            <div
              role="timer"
              aria-label={`Offer ends in ${timeLeft.hours} hours, ${timeLeft.minutes} minutes`}
              className="flex items-start gap-2 sm:gap-3"
            >
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <span aria-hidden="true" className="pt-4 font-display text-2xl font-bold sm:pt-7 sm:text-4xl">:</span>
              <TimeUnit value={timeLeft.minutes} label="Minutes" />
              <span aria-hidden="true" className="pt-4 font-display text-2xl font-bold sm:pt-7 sm:text-4xl">:</span>
              <TimeUnit value={timeLeft.seconds} label="Seconds" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
