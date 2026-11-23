import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    console.log("Newsletter email:", email);
    setEmail("");
  };

  return (
    <section className="bg-white px-5 py-10 text-[#21131C] sm:px-8 sm:py-12 lg:bg-[#21131C] lg:px-[7.7%] lg:pt-14 lg:text-[#F7F4EF]">
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-2 lg:items-end lg:gap-10">
        <div>
          <h2 className="font-script text-[32px] leading-tight sm:text-4xl lg:text-5xl">
            Good clothes, good company.
          </h2>

          <p className="mt-3 max-w-md text-xs leading-6 text-[#77716D] sm:text-sm lg:text-[#D0CDCA]">
            New pieces, fabric stories and practical care notes. Sent
            occasionally.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <label
            htmlFor="newsletter-email"
            className="mb-2 block text-[11px] font-medium sm:text-xs"
          >
            Email address
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              id="newsletter-email"
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 w-full min-w-0 rounded-lg border border-[#D8D2CE] bg-white px-4 text-xs text-[#282522] outline-none transition-all placeholder:text-[#8C8681] focus:border-[#C95738] focus:ring-1 focus:ring-[#C95738] sm:text-sm"
            />

            <button
              type="submit"
              className="h-11 w-full shrink-0 rounded-lg bg-[#F12D6F] px-7 text-xs font-medium text-white transition-colors hover:bg-[#AD452B] focus:outline-none focus:ring-2 focus:ring-[#C95738] sm:w-auto sm:rounded-full sm:text-sm"
            >
              Join us
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
