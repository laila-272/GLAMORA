import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import "../Styles/Home.css";
import hero from "../assets/e/hero.png";
import sign from "../assets/e/sign.png";
import Categories from "./Categories.jsx";
import TestimonialsSection from "./Testimonial.jsx";
import Newsletter from "../Components/Newsletter.jsx";
import womenImg from "../assets/e/01/women.png";
import menImg from "../assets/e/01/men.png";
import unisexImg from "../assets/e/01/uni.png";
import newImg from "../assets/e/01/new.png";
import giftImg from "../assets/e/01/gift.png";
import note1 from "../assets/notes1.png";
import note2 from "../assets/notes2.png";
import note3 from "../assets/notes3.png";

const collections = [
  {
    img: womenImg,
    alt: "Jo Malone English Pear & Freesia",
    label: "THE FLORAL COLLECTION",
    title: "For her, for every day.",
    cta: "Shop women",
    href: "/shop?category=women",
  },
  {
    img: menImg,
    alt: "Dior Sauvage Eau de Parfum",
    label: "WARMLY COMPOSED",
    title: "Depth, in every note.",
    cta: "Shop men",
    href: "/shop?category=men",
  },
  {
    img: giftImg,
    alt: "Chanel Chance Eau Tendre",
    label: "MADE TO GIVE",
    title: "Little bottles. Big joy.",
    cta: "Shop gifts",
    href: "/shop?filter=gifts",
  },
];

const categories = [
  { label: "Women", img: womenImg, href: "/shop?category=women" },
  { label: "Men", img: menImg, href: "/shop?category=men" },
  { label: "Unisex", img: unisexImg, href: "/shop?category=unisex" },
  { label: "New in", img: newImg, href: "/shop?filter=new" },
  { label: "Gift ideas", img: giftImg, href: "/shop?filter=gifts" },
];

const bannerSlides = [
  {
    line1: "After dark.",
    line2: "Your signature.",
    desc: "Discover Tom Ford Oud Wood. An iconic scent for your fragrance collection.",
    cta: "Discover Oud",
    href: "/shop?filter=new",
  },
  {
    line1: "Warm amber.",
    line2: "Lasting trail.",
    desc: "Rich evening compositions crafted to linger long after midnight.",
    cta: "Shop Evening Edit",
    href: "/shop?category=unisex",
  },
  {
    line1: "Velvet spice.",
    line2: "Pure allure.",
    desc: "Explore bold oriental and woody notes curated for special occasions.",
    cta: "Explore Woods",
    href: "/shop?category=men",
  },
];

const marquee = [
  "Free delivery over EGP 2,000",
  "Free delivery over EGP 2,000",
  "Perfumes",
  "Easy 14-day returns",
  "Example catalog prices",
];

const notes = [
  {
    title: "Top · First impression",
    text: "The bright opening of a fragrance: citrus, fresh greens and other revealing notes.",
  },
  {
    title: "Heart · The character",
    text: "The heart reveals the main character, from delicate florals to warm spices.",
  },
  {
    title: "Base · The depth",
    text: "Woods, musks and other base notes provide depth. Every brand tells its own story.",
  },
];

// Reusable Scroll Reveal Component
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setSlide((s) => (s + 1) % bannerSlides.length),
      6000,
    );
    return () => clearInterval(t);
  }, []);

  const currentBanner = bannerSlides[slide];

  return (
    <main className="overflow-x-hidden text-[#2a1a1c]">
      {/* Hero */}
      <section
        className="
          relative isolate flex min-h-[475px] items-start
          overflow-hidden bg-[#fff7f8]
          sm:min-h-[500px]
          md:min-h-[540px] md:items-center
          lg:aspect-[2.38/1] lg:min-h-0
        "
      >
        {/* Animated Background Layer */}
        <div
          className="
            animate-hero-bg absolute inset-0 -z-10 bg-cover bg-[position:right_center]
            after:pointer-events-none after:absolute after:inset-0
            after:bg-[linear-gradient(90deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.55)_40%,rgba(0,0,0,0.4)_100%)]
            md:bg-center md:after:content-none
          "
          style={{ backgroundImage: `url(${hero})` }}
        />

        <div
          className="
            relative z-10 mx-auto w-full max-w-[1945px]
            px-[30px] pt-[55px] pb-6
            sm:px-10 sm:pt-12
            md:px-[7.5%] md:py-0
          "
        >
          <div className="relative z-10 w-full md:max-w-[500px] lg:max-w-[46%]">
            <h1
              className="
                animate-fade-up font-script text-[clamp(50px,11.8vw,62px)]
                leading-[0.98] tracking-[-0.025em]
                md:text-[clamp(70px,8vw,130px)]
                md:leading-[0.95]
              "
            >
              Your scent.
              <br />
              <span className="ml-[0.25em]">Your signature.</span>
            </h1>

            <p
              className="
                animate-fade-up delay-100 mt-[22px] max-w-[430px]
                text-[18px] leading-[1.6]
                sm:text-[19px]
                md:mt-4 md:text-[15px] md:leading-relaxed
                lg:text-[clamp(13px,1.05vw,18px)]
              "
            >
              Original imported perfumes from iconic international brands.
              Discover your next signature.
            </p>

            <div
              className="
                animate-fade-up delay-200 mt-[38px] flex flex-col gap-3
                sm:mt-8
                md:flex-row md:flex-wrap
              "
            >
              <a
                href="/shop?filter=new"
                className="
                  flex h-[64px] w-full items-center justify-center
                  rounded-full bg-[#f4256b] px-6
                  text-[16px] font-semibold text-white
                  transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 hover:shadow-md
                  md:h-11 md:w-auto md:px-6 md:text-[13px]
                "
              >
                Shop new arrivals
              </a>

              <a
                href="/shop"
                className="
                  flex h-[36px] w-full items-center justify-center
                  text-[16px] font-medium text-[#f4256b]
                  transition-all duration-300 hover:-translate-y-0.5 hover:opacity-80
                  md:h-10 md:w-auto md:rounded-full
                  md:border md:border-[#e6d6da]
                  md:bg-white/90 md:px-6 md:text-[13px]
                  md:text-[#2a1a1c]
                "
              >
                Explore the edit
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="flex h-9 items-center overflow-hidden bg-[#f59ac0] sm:h-10">
        <div className="marquee-track flex shrink-0 whitespace-nowrap text-[10px] font-medium uppercase tracking-wider sm:text-[11px]">
          {[0, 1].map((k) => (
            <div
              key={k}
              className="flex shrink-0 items-center"
              aria-hidden={k === 1}
            >
              {marquee.map((m, i) => (
                <span key={i} className="px-8 sm:px-12 md:px-16">
                  {m}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="bg-white px-5 py-10 sm:px-8 md:py-12">
        <div className="mx-auto grid max-w-[1300px] grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c, idx) => (
            <Reveal
              key={c.label}
              delay={idx * 90}
              className={
                idx === categories.length - 1 ? "col-span-2 sm:col-span-1" : ""
              }
            >
              <a href={c.href} className="group flex flex-col items-center">
                <div className="flex h-[160px] w-full items-center justify-center sm:h-[200px] md:h-[240px]">
                  <img
                    src={c.img}
                    alt={c.label}
                    className="bottle-hover h-full w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <span className="mt-3 font-serif text-[15px] transition-colors duration-300 group-hover:text-[#f4256b] sm:mt-4 sm:text-[16px]">
                  {c.label}
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Discover the notes */}
      <section className="bg-[#fff1f6] px-5 py-12 sm:px-8 md:px-[7.5%] md:py-16">
        <div className="mx-auto grid max-w-[1945px] items-center gap-8 md:grid-cols-[1fr_1.05fr] md:gap-12">
          <Reveal>
            <h2 className="font-script text-[clamp(38px,5.2vw,96px)] leading-[0.95]">
              Discover the notes.
              <br />
              Find your scent.
            </h2>
            <p className="mt-5 max-w-[28em] text-[13px] leading-relaxed sm:text-[14px]">
              Top, heart and base notes reveal a fragrance in layers. Explore
              scent families before choosing your next original.
            </p>
            <a
              href="/about"
              className="group mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium underline underline-offset-4 sm:text-[13px]"
            >
              Read our story{" "}
              <ArrowRight
                size={13}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </Reveal>

          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">
            {[note1, note2, note3].map((src, i) => (
              <Reveal key={i} delay={i * 120}>
                <div className="overflow-hidden rounded-sm">
                  <img
                    src={src}
                    alt={notes[i].title}
                    className="aspect-[3.6/1] w-full object-cover transition-transform duration-700 ease-out hover:scale-105 sm:aspect-[4.8/1] lg:aspect-[5.6/1]"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-10 grid max-w-[1945px] gap-6 sm:grid-cols-3 md:mt-16 md:gap-8">
          {notes.map((n, i) => (
            <Reveal
              key={n.title}
              delay={i * 100}
              className="border-t border-[#f3d4e0] pt-4 sm:border-none sm:pt-0"
            >
              <h3 className="text-[13px] font-semibold sm:text-[14px]">
                {n.title}
              </h3>
              <p className="mt-1.5 max-w-[28em] text-[12px] leading-relaxed text-[#4f383b] sm:text-[13px]">
                {n.text}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <Categories />

      {/* Secondary Banner (After dark) */}
      <section
        className="
          relative isolate flex min-h-[440px] items-center overflow-hidden
          bg-[#fdf3f6] bg-cover bg-[position:70%_center]
          sm:min-h-[500px]
          md:bg-center
          after:pointer-events-none after:absolute after:inset-0 after:z-0
          after:bg-[linear-gradient(90deg,rgba(253,243,246,0.88)_0%,rgba(253,243,246,0.62)_45%,rgba(253,243,246,0.08)_100%)]
          after:content-['']
          md:after:content-none
          lg:aspect-[2.38/1] lg:min-h-0
        "
        style={{ backgroundImage: `url(${sign})` }}
      >
        <div className="relative z-10 mx-auto w-full max-w-[1945px] px-5 pb-16 pt-16 sm:px-8 sm:pb-16 sm:pt-20 md:px-[7.5%] md:py-0">
          {/* Keyed wrapper triggers smooth fade-up whenever slide changes */}
          <div
            key={slide}
            className="animate-fade-up max-w-[480px] sm:max-w-[540px] lg:max-w-[46%]"
          >
            <h2 className="font-script text-[clamp(50px,11.8vw,66px)] leading-[0.98] md:text-[clamp(42px,6.4vw,118px)] md:leading-[0.95]">
              {currentBanner.line1}
              <br />
              <span className="ml-[0.2em] sm:ml-[0.35em]">
                {currentBanner.line2}
              </span>
            </h2>

            <p className="mt-4 max-w-[26em] text-[13px] leading-relaxed sm:text-[15px] lg:text-[clamp(13px,1.05vw,18px)] lg:leading-snug">
              {currentBanner.desc}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={currentBanner.href}
                className="rounded-full bg-[#f4256b] px-6 py-3 text-center text-[13px] font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:opacity-90 sm:py-2.5 lg:text-[clamp(12px,0.9vw,15px)]"
              >
                {currentBanner.cta}
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
          {bannerSlides.map((_, i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide ? "w-6 bg-[#f4256b]" : "w-1.5 bg-[#f4a9c2]"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="bg-[#f8f4f0] px-5 py-12 sm:px-8 md:px-10 md:py-16">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-12 md:grid-cols-3 md:gap-8">
          {collections.map((c, idx) => (
            <Reveal key={c.label} delay={idx * 130}>
              <a
                href={c.href}
                className="group flex flex-col items-center text-center"
              >
                <div className="flex h-[240px] w-full items-end justify-center sm:h-[270px] lg:h-[300px]">
                  <img
                    src={c.img}
                    alt={c.alt}
                    className="bottle-hover max-h-full max-w-full object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
                <span className="font-mono-label mt-3 text-[10px] uppercase tracking-[0.08em] text-[#6d5457]">
                  {c.label}
                </span>
                <span className="font-script mt-1 text-[26px] leading-tight sm:text-[28px]">
                  {c.title}
                </span>
                <span className="mt-2.5 inline-flex items-center gap-1 text-[12px] font-medium underline underline-offset-4">
                  {c.cta}{" "}
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      <TestimonialsSection />
      <Newsletter />
    </main>
  );
}
