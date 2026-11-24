import { useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "../../Context/AuthContext.jsx";
import {
  CODE_LENGTH,
  DEMO_CODE,
  authConfig,
  requestEmailCode,
  verifyEmailCode,
  signInWithGoogle,
} from "./AuthService.js";
// import "../Styles/Home.css";
import signin from "../../assets/signin.png";
import code from "../../assets/code.png";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_SECONDS = 30;

// Promo images per step (existing project assets).
const PROMO = {
  signin: { src: "../../assets/signin.png", alt: "Chanel Chance Eau Tendre" },
  verify: { src: "/images/product-armani.png", alt: "Armani Acqua di Giò" },
};

const input =
  "h-11 w-full rounded-xl border border-[#e4dfe2] bg-white px-4 text-[12px] text-[#292329] outline-none placeholder:text-[#a9a2a8] focus:border-[#f72568]";
const primary =
  "h-11 w-full rounded-full bg-[#f72568] text-[12px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60";
const social =
  "flex h-10 items-center justify-center gap-2 rounded-xl border border-[#e4dfe2] bg-white text-[11px] font-medium disabled:opacity-60";

const GoogleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden="true">
    <path
      fill="#EA4335"
      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
    />
    <path
      fill="#4285F4"
      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
    />
    <path
      fill="#FBBC05"
      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
    />
    <path
      fill="#34A853"
      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
    />
  </svg>
);
const AppleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
    />
  </svg>
);

/** Right-hand promotional panel — independent of the step content. */
function PromoPanel({ step }) {
  const { src, alt } = PROMO[step];
  return (
    <aside className="hidden flex-col rounded-2xl bg-[#fff5f8] px-8 py-7 md:flex">
      <div className="flex h-[210px] items-center justify-center">
        <img
          src={signin}
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
  const [step, setStep] = useState("signin"); // "signin" | "verify"
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(null); // "send" | "verify" | "resend" | "google" | null
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeAuth();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [closeAuth]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const demoNote = authConfig.demo
    ? ` Demo mode: no email is sent — use code ${DEMO_CODE}.`
    : "";
  const reset = () => {
    setError("");
    setInfo("");
  };

  const sendCode = async (e) => {
    e.preventDefault();
    reset();
    const value = email.trim();
    if (!value) return setError("Please enter your email address.");
    if (!EMAIL_RE.test(value))
      return setError("Please enter a valid email address.");
    setBusy("send");
    try {
      await requestEmailCode(value);
      setEmail(value);
      setCode("");
      setCooldown(RESEND_SECONDS);
      setStep("verify");
      setInfo(demoNote.trim());
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    reset();
    const value = code.trim();
    if (!value) return setError("Please enter the code from your email.");
    if (!/^\d+$/.test(value) || value.length !== CODE_LENGTH)
      return setError(`The code is ${CODE_LENGTH} digits.`);
    setBusy("verify");
    try {
      login(await verifyEmailCode(email, value)); // existing email → signs in; new email → backend creates the account
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  };

  const resend = async () => {
    if (cooldown > 0 || busy) return;
    reset();
    setBusy("resend");
    try {
      await requestEmailCode(email);
      setCooldown(RESEND_SECONDS);
      setInfo(`A new code has been sent.${demoNote}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const google = async () => {
    reset();
    setBusy("google");
    try {
      login(await signInWithGoogle());
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  };

  const changeEmail = () => {
    reset();
    setCode("");
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
                <button
                  type="button"
                  onClick={google}
                  disabled={!!busy}
                  className={social}
                >
                  <GoogleIcon /> {busy === "google" ? "Connecting…" : "Google"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setError("Apple sign-in isn't available yet.");
                  }}
                  disabled={!!busy}
                  className={social}
                >
                  <AppleIcon /> Apple
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
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value.replace(/\D/g, ""));
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

        <PromoPanel step={step} />
      </div>
    </div>
  );
}
