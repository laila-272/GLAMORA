import { useEffect, useId } from "react";
import { X } from "lucide-react";

/** Reusable accessible dialog: Esc / backdrop / close button dismiss it. */
export default function Modal({
  title,
  onClose,
  children,
  size = "max-w-[520px]",
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#292329]/40 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(e) => e.stopPropagation()}
        className={`max-h-[92vh] w-full ${size} overflow-y-auto rounded-2xl bg-white p-6`}
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id={titleId}
            className="font-serif text-[24px] font-medium leading-tight"
          >
            {title}
          </h2>
          <button type="button" autoFocus onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
