import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import { subscribeToNewsletter } from "../../api/mockApi";
import logoMark from "../../assets/icons/logo-mark.svg";
import { validateEmail } from "../../utils/validators";
import { toast } from "../common/Toast";

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Categories", to: "/#categories" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Deals", to: "/deals" },
];

// Support pages are outside this frontend demo, so these open an email draft.
const SUPPORT_LINKS = [
  { label: "Contact", href: "mailto:support@praharx.example?subject=Contact" },
  { label: "FAQ", href: "mailto:support@praharx.example?subject=FAQ" },
  {
    label: "Shipping",
    href: "mailto:support@praharx.example?subject=Shipping",
  },
  { label: "Returns", href: "mailto:support@praharx.example?subject=Returns" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
  { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
  { label: "X (Twitter)", href: "https://x.com/", icon: Twitter },
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: Linkedin },
];

const linkClasses = "text-sm text-mist transition-colors hover:text-volt";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = validateEmail(email);
    setError(message);
    if (message) return;

    setSubmitting(true);
    try {
      await subscribeToNewsletter(email);
      toast.success("Subscribed. Watch your inbox for offers.");
      setEmail("");
    } catch (requestError) {
      toast.error(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative mt-10 overflow-hidden border-t bg-ink-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[50rem] -translate-x-1/2 rounded-full bg-volt/[0.07] blur-[110px]"
      />

      <div className="shell relative py-14 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.3fr] lg:gap-12">
          {/* About */}
          <div>
            <Link
              to="/"
              aria-label="PraharX home"
              className="inline-flex items-center gap-2.5"
            >
              <img
                src={logoMark}
                alt=""
                width="30"
                height="30"
                className="size-[1.875rem] bg-transparent"
              />
              <span className="font-display text-lg font-bold tracking-[0.08em] text-white">
                Techvune<span className="text-volt">X</span>
              </span>
            </Link>
            <h2 className="mt-6 text-[0.6875rem] font-bold tracking-[0.24em] text-white uppercase">
              About
            </h2>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">
              TechvuneX is a next generation store for fashion, technology and
              living. Carefully chosen products, fair prices and service that
              respects your time.
            </p>
            <ul className="mt-6 flex gap-2" aria-label="Social media">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    className="glass flex size-10 items-center justify-center rounded-full text-white transition-all hover:-translate-y-1 hover:bg-volt hover:text-ink-950"
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links">
            <h2 className="text-[0.6875rem] font-bold tracking-[0.24em] text-white uppercase">
              Quick links
            </h2>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Support">
            <h2 className="text-[0.6875rem] font-bold tracking-[0.24em] text-white uppercase">
              Support
            </h2>
            <ul className="mt-4 space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={linkClasses}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter */}
          <div>
            <h2 className="text-[0.6875rem] font-bold tracking-[0.24em] text-white uppercase">
              Newsletter
            </h2>
            <p className="mt-4 text-sm text-mist">
              Offers and new arrivals, twice a month. No spam.
            </p>
            <form onSubmit={handleSubmit} noValidate className="mt-4">
              <div className="flex gap-2">
                <label htmlFor="footer-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter your email"
                  autoComplete="email"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "footer-email-error" : undefined}
                  className="field h-11 min-w-0 flex-1 rounded-full py-0"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label="Subscribe to newsletter"
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-volt text-ink-950 transition-colors hover:bg-white disabled:opacity-50"
                >
                  <ArrowRight className="size-4" aria-hidden="true" />
                </button>
              </div>
              {error && (
                <p
                  id="footer-email-error"
                  role="alert"
                  className="mt-2 text-xs font-semibold text-ember"
                >
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t pt-6 text-xs text-mist sm:flex-row">
          <p>© 2026 TechvuneX. All rights reserved.</p>
          <p>Frontend demo — no real orders or payments are processed.</p>
        </div>
      </div>
    </footer>
  );
}
