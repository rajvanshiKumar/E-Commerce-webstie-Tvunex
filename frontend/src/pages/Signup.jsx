import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/auth/AuthForm';
import { siteImages } from '../data/images';
import useAuth from '../hooks/useAuth';
import { imageProps } from '../utils/imageFallback';

export default function Signup() {
  const { isAuthenticated, isSubmitting } = useAuth();
  const location = useLocation();

  useEffect(() => {
    document.title = 'Sign up — PRAHARX';
  }, []);

  // Already signed in (and not mid-submit, where AuthForm handles the redirect).
  if (isAuthenticated && !isSubmitting) {
    return <Navigate to={location.state?.from ?? '/account'} replace />;
  }

  return (
    <div className="shell py-8 sm:py-14">
      <div className="grid items-stretch gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Visual panel */}
        <div className="relative hidden min-h-[40rem] overflow-hidden rounded-[2rem] border lg:block">
          <img
            {...imageProps(siteImages.authPanel.src, siteImages.authPanel.remote)}
            alt={siteImages.authPanel.alt}
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
          <div className="absolute inset-x-10 bottom-10">
            <p className="eyebrow">PraharX members</p>
            <p className="display mt-4 text-4xl whitespace-pre-line text-white">{'Join the next\ngeneration.'}</p>
            <p className="mt-4 max-w-sm text-base text-zinc-300">Create an account in under a minute. No card needed.</p>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <AuthForm mode="signup" />
        </div>
      </div>
    </div>
  );
}
