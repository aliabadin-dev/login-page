"use client";

import { useState, useRef, useEffect, FormEvent, KeyboardEvent } from "react";
import { Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

type FormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

type FormStatus = "idle" | "loading" | "success" | "error";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [touched, setTouched] = useState({ email: false, password: false });

  const emailRef = useRef<HTMLInputElement>(null);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Auto-focus email on mount (desktop only to avoid keyboard pop on mobile)
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!isTouch && emailRef.current) {
      emailRef.current.focus();
    }
  }, []);

  const validateEmail = (value: string): string | undefined => {
    if (!value.trim()) return "Email is required";
    // Simple but practical email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Enter a valid email address";
    }
    return undefined;
  };

  const validatePassword = (value: string): string | undefined => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return undefined;
  };

  const validate = (): FormErrors => {
    const next: FormErrors = {};
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    if (emailErr) next.email = emailErr;
    if (passErr) next.password = passErr;
    return next;
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((t) => ({ ...t, [field]: true }));
    const next = { ...errors };
    if (field === "email") {
      const e = validateEmail(email);
      if (e) next.email = e;
      else delete next.email;
    } else {
      const p = validatePassword(password);
      if (p) next.password = p;
      else delete next.password;
    }
    setErrors(next);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      // Move focus to error summary for screen readers & keyboard users
      requestAnimationFrame(() => {
        errorSummaryRef.current?.focus();
      });
      return;
    }

    setStatus("loading");
    setErrors({});

    // Simulated network request — replace with real auth (Server Action / API)
    try {
      await new Promise((r) => setTimeout(r, 1400));

      // Demo: reject a known bad credential so UX error path is visible
      if (email.toLowerCase() === "fail@example.com") {
        setStatus("error");
        setErrors({ form: "Invalid email or password. Please try again." });
        requestAnimationFrame(() => errorSummaryRef.current?.focus());
        return;
      }

      setStatus("success");
      // In a real app you would redirect here (router.push / window.location)
    } catch {
      setStatus("error");
      setErrors({ form: "Something went wrong. Please try again." });
      requestAnimationFrame(() => errorSummaryRef.current?.focus());
    }
  };

  const hasFieldErrors = Boolean(errors.email || errors.password);
  const showSummary = status === "error" && (hasFieldErrors || errors.form);

  return (
    <div className="w-full max-w-[400px] mx-auto px-4 sm:px-0">
      {/* Logo / Brand mark */}
      <div className="mb-10 text-center">
        <div
          className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 mb-5"
          aria-hidden="true"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-red-500"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign in to continue
        </p>
      </div>

      {/* Error summary — critical for accessibility */}
      {showSummary && (
        <div
          ref={errorSummaryRef}
          role="alert"
          tabIndex={-1}
          aria-labelledby="error-summary-title"
          className="mb-6 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 outline-none"
        >
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" aria-hidden />
            <div>
              <h2 id="error-summary-title" className="text-sm font-medium text-red-300">
                {errors.form ? "Unable to sign in" : "There is a problem"}
              </h2>
              {errors.form ? (
                <p className="mt-1 text-sm text-red-200/90">{errors.form}</p>
              ) : (
                <ul className="mt-1.5 list-disc list-inside space-y-0.5 text-sm text-red-200/90">
                  {errors.email && (
                    <li>
                      <a href="#email" className="underline underline-offset-2 hover:text-white focus-visible:text-white">
                        {errors.email}
                      </a>
                    </li>
                  )}
                  {errors.password && (
                    <li>
                      <a href="#password" className="underline underline-offset-2 hover:text-white focus-visible:text-white">
                        {errors.password}
                      </a>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Success state */}
      {status === "success" && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-green-500/40 bg-green-500/10 px-4 py-3 flex items-start gap-2"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-400 mt-0.5" aria-hidden />
          <div>
            <p className="text-sm font-medium text-green-300">Signed in successfully</p>
            <p className="mt-0.5 text-sm text-green-200/80">Redirecting…</p>
          </div>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={handleSubmit}
        noValidate
        className="space-y-5"
        aria-busy={status === "loading"}
      >
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-300 mb-1.5"
          >
            Email
          </label>
          <input
            ref={emailRef}
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            enterKeyHint="next"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (touched.email) {
                const err = validateEmail(e.target.value);
                setErrors((prev) => {
                  const n = { ...prev };
                  if (err) n.email = err;
                  else delete n.email;
                  return n;
                });
              }
            }}
            onBlur={() => handleBlur("email")}
            disabled={status === "loading" || status === "success"}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`
              w-full h-12 px-4 rounded-lg bg-zinc-900 border text-white
              placeholder:text-zinc-500
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
              disabled:opacity-60 disabled:cursor-not-allowed
              text-base
              ${errors.email ? "border-red-500/70" : "border-zinc-700 hover:border-zinc-600"}
            `}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="email-error" className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-300"
            >
              Password
            </label>
            <a
              href="#forgot"
              className="text-sm text-zinc-400 hover:text-red-400 focus-visible:text-red-400 transition-colors"
              tabIndex={status === "loading" ? -1 : 0}
            >
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              enterKeyHint="done"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (touched.password) {
                  const err = validatePassword(e.target.value);
                  setErrors((prev) => {
                    const n = { ...prev };
                    if (err) n.password = err;
                    else delete n.password;
                    return n;
                  });
                }
              }}
              onBlur={() => handleBlur("password")}
              disabled={status === "loading" || status === "success"}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`
                w-full h-12 pl-4 pr-12 rounded-lg bg-zinc-900 border text-white
                placeholder:text-zinc-500
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                disabled:opacity-60 disabled:cursor-not-allowed
                text-base
                ${errors.password ? "border-red-500/70" : "border-zinc-700 hover:border-zinc-600"}
              `}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              disabled={status === "loading" || status === "success"}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 disabled:opacity-50 cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={0}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" aria-hidden />
              ) : (
                <Eye className="h-5 w-5" aria-hidden />
              )}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1.5 text-sm text-red-400 flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {errors.password}
            </p>
          )}
        </div>

        {/* Remember me */}
        <div className="flex items-center gap-3">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            disabled={status === "loading" || status === "success"}
            className="h-4 w-4 rounded border-zinc-600 bg-zinc-900 text-red-500 focus:ring-red-500 focus:ring-offset-0 focus:ring-offset-black cursor-pointer accent-red-500"
          />
          <label htmlFor="remember" className="text-sm text-zinc-400 cursor-pointer select-none">
            Remember me for 30 days
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className={`
            relative w-full h-12 rounded-lg font-medium text-white
            bg-red-500 hover:bg-red-600 active:bg-red-700
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black
            disabled:opacity-70 disabled:cursor-not-allowed
            cursor-pointer
            flex items-center justify-center gap-2
            text-base
          `}
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
              <span>Signing in…</span>
            </>
          ) : status === "success" ? (
            <>
              <CheckCircle2 className="h-5 w-5" aria-hidden />
              <span>Success</span>
            </>
          ) : (
            <span>Sign in</span>
          )}
        </button>
      </form>

      {/* Footer links */}
      <p className="mt-8 text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <a
          href="#signup"
          className="font-medium text-red-400 hover:text-red-300 focus-visible:text-red-300 underline-offset-2 hover:underline"
        >
          Create one
        </a>
      </p>

      {/* Demo helper */}
      <p className="mt-6 text-center text-xs text-zinc-600">
        Demo: use any email except{" "}
        <code className="text-zinc-500">fail@example.com</code>
      </p>
    </div>
  );
}
