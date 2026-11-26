import { GoogleLogin } from "@react-oauth/google";
import { Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext.jsx";

import {
  CODE_LENGTH,
  requestEmailCode,
  signInWithGoogle,
  verifyEmailCode,
} from "../../Services/AuthService.js";

import code from "../../assets/code.png";
import signin from "../../assets/signin.png";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_SECONDS = 30;

const input =
  "h-11 w-full rounded-xl border border-[#e4dfe2] bg-white px-4 text-[12px] text-[#292329] outline-none placeholder:text-[#a9a2a8] focus:border-[#f72568]";

const primary =
  "h-11 w-full rounded-full bg-[#f72568] text-[12px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60";

const social =
  "flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e4dfe2] bg-white text-[11px] font-medium disabled:opacity-60";

/** Right-hand promotional panel */
function PromoPanel({ step }) {
  const isVerify = step === "verify";

  const src = isVerify ? code : signin;
  const alt = isVerify ? "Email verification" : "Chanel Chance Eau Tendre";

  return (
    <aside className="hidden flex-col rounded-2xl bg-[#fff5f8] px-8 py-7 md:flex">
      <div className="flex h-[210px] items-center justify-center">
        <img
          src={src}
          alt={alt}
          className="max-h-full max-w-full object-contain"
        />
      </div>

      <p className="mt-4 font-script text-[24px] leading-tight">
        Scents that belong in your life.
      </p>

      <p className="mt-4 text-[13px] leading-[1.55] text-[#292329]">
        Original imported perfumes. Iconic brands, niche finds and a scent that
        feels like you.
      </p>
    </aside>
  );
}

function StepTitle({ tab, heading }) {
  return (
    <>
      <p className="inline-block border-b border-[#f72568] pb-1.5 pr-10 text-[13px] font-medium text-[#f72568]">
        {tab}
      </p>

      <h2
        id="auth-title"
        className="mt-4 font-script text-[32px] leading-tight"
      >
        {heading}
      </h2>
    </>
  );
}

function Feedback({ error, info }) {
  return (
    <div aria-live="polite" className="min-h-[18px] text-[11px]">
      {error && (
        <p role="alert" className="text-[#d6204f]">
          {error}
        </p>
      )}

      {!error && info && <p className="text-[#5b6a46]">{info}</p>}
    </div>
  );
}

export default function AuthModal() {
  const { closeAuth, login } = useAuth();

  const [step, setStep] = useState("signin");
  const [email, setEmail] = useState("");
  const [codeValue, setCodeValue] = useState("");

  const [busy, setBusy] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  // Close modal with Escape + prevent background scrolling
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") closeAuth();
    };

    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeAuth]);

  // Resend countdown
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((current) => current - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  const reset = () => {
    setError("");
    setInfo("");
  };

  // Send email verification code
  const sendCode = async (e) => {
    e.preventDefault();
    reset();

    const value = email.trim();

    if (!value) {
      return setError("Please enter your email address.");
    }

    if (!EMAIL_RE.test(value)) {
      return setError("Please enter a valid email address.");
    }

    setBusy("send");

    try {
      await requestEmailCode(value);

      setEmail(value);
      setCodeValue("");
      setCooldown(RESEND_SECONDS);
      setStep("verify");
      setInfo("A verification code has been sent to your email.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  // Verify email code
  const verify = async (e) => {
    e.preventDefault();
    reset();

    const value = codeValue.trim();

    if (!value) {
      return setError("Please enter the code from your email.");
    }

    if (!/^\d+$/.test(value) || value.length !== CODE_LENGTH) {
      return setError(`The code is ${CODE_LENGTH} digits.`);
    }

    setBusy("verify");

    try {
      const result = await verifyEmailCode(email, value);
      login(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  // Resend email code
  const resend = async () => {
    if (cooldown > 0 || busy) return;

    reset();
    setBusy("resend");

    try {
      await requestEmailCode(email);

      setCooldown(RESEND_SECONDS);
      setInfo("A new verification code has been sent.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  // Google sign-in success
  const handleGoogleSuccess = async (credentialResponse) => {
    reset();

    const idToken = credentialResponse?.credential;

    if (!idToken) {
      setError("Google didn't return an ID token.");
      return;
    }

    setBusy("google");

    try {
      const result = await signInWithGoogle(idToken);
      login(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  // Google sign-in failure
  const handleGoogleError = () => {
    setError("Google sign-in failed. Please try again.");
    setBusy(null);
  };

  // Change email
  const changeEmail = () => {
    reset();
    setCodeValue("");
    setStep("signin");
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#292329]/45 p-4"
      onMouseDown={closeAuth}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(e) => e.stopPropagation()}
        className="grid w-full max-w-[860px] gap-6 rounded-xl bg-white p-4 text-[#292329] md:grid-cols-[46fr_50fr] md:p-5"
      >
        {/* Form section */}
        <div className="px-1 pb-2 pt-4 md:pb-4 md:pl-2 md:pt-6">
          {step === "signin" ? (
            <form onSubmit={sendCode} noValidate>
              <StepTitle tab="Sign in" heading="Good to see you." />

              <p className="mt-3 text-[12px] leading-[1.5] text-[#4a424a]">
                Sign in with your email and continue with a verification code.
              </p>

              <label htmlFor="auth-email" className="sr-only">
                Email address
              </label>

              <input
                id="auth-email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Your email address"
                className={`${input} mt-5`}
              />

              <button
                type="submit"
                disabled={busy === "send"}
                className={`${primary} mt-3`}
              >
                {busy === "send" ? "Sending code…" : "Send verification code"}
              </button>

              <p className="my-3 text-center text-[12px]">Or</p>

              <div className="grid grid-cols-2 gap-3">
                {/* Google Login */}
                <div
                  className={`flex h-10 w-full items-center justify-center overflow-hidden rounded-xl border border-[#e4dfe2] ${
                    busy || step !== "signin"
                      ? "pointer-events-none opacity-60"
                      : ""
                  }`}
                >
                  {busy === "google" ? (
                    <span className="text-[11px]">Connecting…</span>
                  ) : (
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      theme="outline"
                      size="large"
                      shape="rectangular"
                      text="signin_with"
                      containerProps={{
                        className: "w-full flex justify-center",
                      }}
                    />
                  )}
                </div>

                {/* Apple Login */}
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setError("Apple sign-in isn't available yet.");
                  }}
                  disabled={!!busy}
                  className={social}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fill="currentColor"
                      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                    />
                  </svg>
                  Apple
                </button>
              </div>

              <div className="mt-3">
                <Feedback error={error} info={info} />
              </div>

              <button
                type="button"
                onClick={closeAuth}
                className="mt-2 text-[12px] underline underline-offset-4"
              >
                Just browsing? Continue as a guest →
              </button>
            </form>
          ) : (
            <form onSubmit={verify} noValidate>
              <StepTitle tab="Verify" heading="Verify your email." />

              <p className="mt-3 text-[13px] leading-[1.5] text-[#292329]">
                We’ve sent a verification code to{" "}
                <span className="break-all font-medium">{email}</span>. Enter it
                below to complete your sign-in.
              </p>

              <label
                htmlFor="auth-code"
                className="mt-5 block text-[11px] font-medium"
              >
                Verification code
              </label>

              <div className="relative mt-2">
                <input
                  id="auth-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  autoFocus
                  maxLength={CODE_LENGTH}
                  value={codeValue}
                  onChange={(e) => {
                    setCodeValue(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="Enter code"
                  className={`${input} pr-10`}
                />

                <Lock
                  size={13}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#c4bec2]"
                />
              </div>

              <button
                type="submit"
                disabled={busy === "verify"}
                className={`${primary} mt-3`}
              >
                {busy === "verify" ? "Verifying…" : "Verify and sign in"}
              </button>

              <p className="mt-3 text-[10px] text-[#6d656c]">
                Use the one-time code from your inbox.
              </p>

              <div className="mt-2">
                <Feedback error={error} info={info} />
              </div>

              <p className="mt-3 text-[12px] text-[#6d656c]">
                Didn’t receive a code?{" "}
                <button
                  type="button"
                  onClick={resend}
                  disabled={cooldown > 0 || !!busy}
                  className="font-medium text-[#f72568] underline underline-offset-2 disabled:no-underline disabled:opacity-60"
                >
                  {busy === "resend"
                    ? "Sending…"
                    : cooldown > 0
                      ? `Resend code (${cooldown}s)`
                      : "Resend code"}
                </button>
              </p>

              <button
                type="button"
                onClick={changeEmail}
                className="mt-2 text-[12px] underline underline-offset-4"
              >
                ← Change email address
              </button>
            </form>
          )}
        </div>

        {/* Promotional section */}
        <PromoPanel step={step} />
      </div>
    </div>
  );
}
