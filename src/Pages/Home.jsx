import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import "../Styles/Home.css";
import hero from "../assets/e/hero.png"
import sign from "../assets/e/sign.png"
import Categories from "./Categories.jsx";
import TestimonialsSection from "./Testimonial.jsx";
import womenImg from "../assets/e/01/women.png";
import menImg from "../assets/e/01/men.png";
import unisexImg from "../assets/e/01/uni.png";
import newImg from "../assets/e/01/new.png";
import giftImg from "../assets/e/01/gift.png";
import note1 from "../assets/notes1.png"
import note2 from "../assets/notes2.png"
import note3 from "../assets/notes3.png"
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
/* Drop your image files in /public/images with these names (or edit the paths). */


const slides = [0, 1, 2]; // three pagination states; swap in distinct slide content if you have it

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

export default function Home() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  return (
    <main className="overflow-x-hidden text-[#2a1a1c]">
      {/* Hero */}
      <section
        className="relative min-h-[420px] bg-[#fdf3f6] bg-cover bg-center md:aspect-[2.38/1] md:min-h-0"
        style={{ backgroundImage: `url(${hero})` }}
      >
        <div className="relative mx-auto grid h-full max-w-[1945px] items-center px-6 py-10 md:px-[7.5%] md:py-0">
          <div className="z-10 max-w-[560px] md:max-w-[46%]">
            <h1 className="font-script text-[clamp(44px,6.4vw,118px)] leading-[0.95]">
              Your scent.
              <br />
              <span className="ml-[0.35em]">Your signature.</span>
            </h1>
            <p className="mt-4 max-w-[26em] text-[clamp(12px,1.05vw,18px)] leading-snug">
              Original imported perfumes from iconic international brands.
              Discover your next signature.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/shop?filter=new"
                className="rounded-full bg-[#f4256b] px-6 py-2.5 text-[12px] font-semibold text-white md:text-[clamp(11px,0.9vw,15px)]"
              >
                Shop new arrivals
              </a>
              <a
                href="/shop"
                className="rounded-full border border-[#e6d6da] bg-white/70 px-6 py-2.5 text-[12px] md:text-[clamp(11px,0.9vw,15px)]"
              >
                Explore the edit
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {slides.map((i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-1 rounded-full transition-all ${i === slide ? "w-5 bg-[#f4256b]" : "w-1 bg-[#f4a9c2]"}`}
            />
          ))}
        </div>
      </section>

      {/* Marquee */}
      <div className="flex h-9 items-center overflow-hidden bg-[#f59ac0] md:h-10">
        <div className="marquee-track flex shrink-0 whitespace-nowrap text-[9px] font-medium uppercase tracking-wider md:text-[10px]">
          {[0, 1].map((k) => (
            <div
              key={k}
              className="flex shrink-0 items-center"
              aria-hidden={k === 1}
            >
              {marquee.map((m, i) => (
                <span key={i} className="px-10 md:px-16">
                  {m}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <section className="bg-white px-4 py-8 md:py-10">
        <div className="mx-auto grid max-w-[1100px] grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group flex flex-col items-center"
            >
              <div className="flex h-[180px] w-full items-center justify-center sm:h-[210px] md:h-[250px]">
                <img
                  src={c.img}
                  alt={c.label}
                  className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <span className="mt-4 font-serif text-[15px]">{c.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Discover the notes */}
      <section className="bg-[#fff1f6] px-6 py-12 md:px-[7.5%] md:py-16">
        <div className="mx-auto grid max-w-[1945px] gap-10 md:grid-cols-[1fr_1.05fr]">
          <div className="md:pt-4">
            <h2 className="font-script text-[clamp(40px,5.2vw,96px)] leading-[0.95]">
              Discover the notes.
              <br />
              Find your scent.
            </h2>
            <p className="mt-6 max-w-[24em] text-[11px] leading-relaxed">
              Top, heart and base notes reveal a fragrance in layers. Explore
              scent families before choosing your next original.
            </p>
            <a
              href="/about"
              className="mt-3 inline-flex items-center gap-1 text-[10px] underline underline-offset-2"
            >
              Read our story <ArrowRight size={10} />
            </a>
          </div>
          <div className="flex flex-col gap-6 md:gap-8">
            {[note1, note2, note3].map((src, i) => (
              <img
                key={i}
                src={src}
                alt={notes[i].title}
                className="aspect-[5.6/1] w-full object-cover"
              />
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1945px] gap-8 md:mt-16 md:grid-cols-3">
          {notes.map((n) => (
            <div key={n.title}>
              <h3 className="text-[11px] font-semibold">{n.title}</h3>
              <p className="mt-1 max-w-[26em] text-[10px] leading-relaxed">
                {n.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Categories />
      <section
        className="relative min-h-[420px] bg-[#fdf3f6] bg-cover bg-center md:aspect-[2.38/1] md:min-h-0"
        style={{ backgroundImage: `url(${sign})` }}
      >
        <div className="relative mx-auto grid h-full max-w-[1945px] items-center px-6 py-10 md:px-[7.5%] md:py-0">
          <div className="z-10 max-w-[560px] md:max-w-[46%]">
            <h1 className="font-script text-[clamp(44px,6.4vw,118px)] leading-[0.95]">
              After dark.
              <br />
              <span className="ml-[0.35em]">Your signature..</span>
            </h1>
            <p className="mt-4 max-w-[26em] text-[clamp(12px,1.05vw,18px)] leading-snug">
              Discover Tom Ford Oud Wood. An iconic scent for your fragrance
              collection.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="/shop?filter=new"
                className="rounded-full bg-[#f4256b] px-6 py-2.5 text-[12px] font-semibold text-white md:text-[clamp(11px,0.9vw,15px)]"
              >
                Shop new arrivals
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {slides.map((i) => (
            <button
              key={i}
              aria-label={`Slide ${i + 1}`}
              onClick={() => setSlide(i)}
              className={`h-1 rounded-full transition-all ${i === slide ? "w-5 bg-[#f4256b]" : "w-1 bg-[#f4a9c2]"}`}
            />
          ))}
        </div>
      </section>
      <section className="bg-[#f8f4f0] px-6 py-12 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-14 sm:grid-cols-3 sm:gap-6">
          {collections.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className="group flex flex-col items-center text-center"
            >
              <div className="flex h-[300px] w-full items-end justify-center">
                <img
                  src={c.img}
                  alt={c.alt}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <span className="font-mono-label mt-2 text-[9px] uppercase tracking-[0.08em]">
                {c.label}
              </span>
              <span className="font-script mt-1 text-[26px] leading-tight md:text-[28px]">
                {c.title}
              </span>
              <span className="mt-2 text-[11px] underline underline-offset-2">
                {c.cta} →
              </span>
            </a>
          ))}
        </div>
      </section>
      <TestimonialsSection />
    </main>
  );
}
