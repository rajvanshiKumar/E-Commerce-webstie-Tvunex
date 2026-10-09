import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { MIN_PASSWORD_LENGTH, validateLogin, validateSignup } from '../../utils/validators';
import Button from '../common/Button';

const COPY = {
  login: {
    eyebrow: 'Welcome back',
    title: 'Log in',
    subtitle: 'Pick up where you left off.',
    submit: 'Log in',
    switchText: 'New to PraharX?',
    switchLabel: 'Create an account',
    switchTo: '/signup',
  },
  signup: {
    eyebrow: 'Join PraharX',
    title: 'Create account',
    subtitle: 'Save your wishlist, track orders and check out faster.',
    submit: 'Sign up',
    switchText: 'Already have an account?',
    switchLabel: 'Log in',
    switchTo: '/login',
  },
};

const ICONS = { name: User, email: Mail, password: Lock, confirmPassword: Lock };

function Field({ id, label, type = 'text', value, error, onChange, autoComplete, hint, trailing }) {
  const Icon = ICONS[id];
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[0.6875rem] font-bold tracking-[0.18em] text-mist uppercase">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-mist" aria-hidden="true" />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={`field pl-11 ${trailing ? 'pr-12' : ''}`}
        />
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-semibold text-ember">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-mist">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

/** Shared form for /login and /signup. `mode` is "login" or "signup". */
export default function AuthForm({ mode = 'login' }) {
  const isSignup = mode === 'signup';
  const copy = COPY[mode] ?? COPY.login;
  const { login, signup, isSubmitting } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? '/account';

  const [values, setValues] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }));
    if (formError) setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = isSignup ? validateSignup(values) : validateLogin(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const result = isSignup
      ? await signup({ name: values.name, email: values.email, password: values.password })
      : await login(values.email, values.password);

    if (result.ok) {
      navigate(redirectTo, { replace: true });
    } else if (isSignup && result.status === 409) {
      setErrors({ email: result.error });
    } else {
      setFormError(result.error ?? 'Something went wrong. Please try again.');
    }
  };

  const fillDemo = () => {
    setValues((current) => ({ ...current, email: 'demo@praharx.com', password: 'demo1234' }));
    setErrors({});
    setFormError('');
  };

  const passwordToggle = (
    <button
      type="button"
      onClick={() => setShowPassword((visible) => !visible)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
      aria-pressed={showPassword}
      className="absolute top-1/2 right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full text-mist transition-colors hover:text-white"
    >
      {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="glass w-full max-w-md rounded-[2rem] p-6 sm:p-10"
    >
      <p className="eyebrow">{copy.eyebrow}</p>
      <h1 className="display mt-3 text-3xl text-white">{copy.title}</h1>
      <p className="mt-2 text-sm text-mist">{copy.subtitle}</p>

      {location.state?.from && (
        <p className="mt-5 rounded-xl border border-volt/30 bg-volt/10 px-4 py-3 text-sm text-volt">
          Please log in to continue.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
        {isSignup && (
          <Field id="name" label="Name" value={values.name} error={errors.name} onChange={handleChange} autoComplete="name" />
        )}
        <Field id="email" label="Email" type="email" value={values.email} error={errors.email} onChange={handleChange} autoComplete="email" />
        <Field
          id="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={values.password}
          error={errors.password}
          onChange={handleChange}
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          hint={isSignup ? `At least ${MIN_PASSWORD_LENGTH} characters.` : undefined}
          trailing={passwordToggle}
        />
        {isSignup && (
          <Field
            id="confirmPassword"
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            value={values.confirmPassword}
            error={errors.confirmPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        )}

        {formError && (
          <p role="alert" className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm font-semibold text-ember">
            {formError}
          </p>
        )}

        <Button type="submit" fullWidth size="lg" loading={isSubmitting} className="mt-2">
          {copy.submit}
        </Button>
      </form>

      {!isSignup && (
        <div className="mt-5 rounded-xl border border-dashed border-white/15 px-4 py-3 text-xs text-mist">
          <p>
            Demo account: <span className="font-semibold text-white">demo@praharx.com</span> /{' '}
            <span className="font-semibold text-white">demo1234</span>
          </p>
          <button type="button" onClick={fillDemo} className="mt-1 font-bold text-volt underline underline-offset-4 hover:text-white">
            Fill demo details
          </button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-mist">
        {copy.switchText}{' '}
        <Link to={copy.switchTo} state={location.state} className="font-bold text-white underline underline-offset-4 hover:text-volt">
          {copy.switchLabel}
        </Link>
      </p>
    </motion.div>
  );
}
