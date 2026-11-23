import { Tag, Leaf, RotateCcw, Users, Gift, Clock } from "lucide-react";
import "../index.css";
import perfumes from "../assets/perfumes.png";
import perfumes1 from "../assets/perfumes1.png";
import perfume1 from "../assets/1.png";
import perfume2 from "../assets/2.png";
import perfume3 from "../assets/3.png";
import notes1 from "../assets/notes1.png";
import notes2 from "../assets/notes2.png";
import notes3 from "../assets/notes3.png";
// import brands from "../assets/brands.jpg"
const highlights = [
  { icon: Tag, label: "Size to suit", value: "30–100ml" },
  { icon: Leaf, label: "Scent families", value: "4 families" },
  { icon: RotateCcw, label: "Easy 14-day returns", value: "14 days" },
];

const ideas = [
  {
    icon: Users,
    title: "Welcoming",
    text: "Scents for different moods, moments and ways of living.",
  },
  {
    icon: Gift,
    title: "Curated",
    text: "Original bottles, original brands. We curate the fragrance houses we trust.",
  },
  {
    icon: Clock,
    title: "Timeless",
    text: "Beautiful scents and rituals that go beyond a season.",
  },
];

const notesImgs = [
  notes1,
  notes2,
notes3,
];

const details = [
  {
    label: "The selection",
    text: "Designer favourites and niche discoveries.",
    img: perfume3,
    alt: "Dior Sauvage",
  },
  {
    label: "The notes",
    text: "International fragrance families and carefully selected scent profiles.",
    notes: true,
  },
  {
    label: "The originals",
    text: "Original packaging, as the brand intended.",
    img: perfume2,
    alt: "Dior J'adore",
  },
];

// Navbar and Footer come from <Layout />, so they are not rendered here.
export default function OurStory() {
  return (
    <main className="overflow-x-hidden text-[#2a1a1c]">
      {/* Iconic brands */}
      <section className="bg-[#fbf8f4]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-12 md:px-[7%] lg:grid-cols-[48fr_42fr] lg:gap-[8%] lg:py-[5.5%]">
          <div className="order-2 lg:order-1">
            <h1 className="font-script text-[clamp(40px,4.6vw,84px)] leading-[1.05]">
              Iconic brands.
              <br />
              Chosen for you.
            </h1>
            <p className="mt-6 max-w-[27em] text-[13px] leading-[1.6] md:text-[14px]">
              GLAMORA brings you original imported perfumes from international
              brands. Discover favourites and niche discoveries, selected for
              you.
            </p>
          </div>
          <img
            src={perfumes1}
            alt="Perfume bottles arranged among botanical shadows"
            className="order-1 aspect-[0.97/1] w-full rounded-[40px] object-cover lg:order-2"
          />
        </div>
      </section>

      {/* Fragrance information */}
      <section className="bg-gradient-to-r from-[#efeff0] via-[#fbf8f9] to-[#fffafc]">
        <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-6 py-12 md:px-[7%] lg:grid-cols-[1fr_1.05fr] lg:gap-[6%] lg:py-[3.5%]">
          <img
            src={perfumes}
            alt="Perfume bottles with butterflies and botanical details"
            className="aspect-square w-full rounded-[45px] object-cover"
          />
          <div>
            <h2 className="font-script text-[clamp(36px,3.9vw,72px)] leading-[1.25]">
              Fragrance for every mood and
              <br className="hidden md:block" /> every season.
            </h2>
            <p className="mt-5 max-w-[34em] text-[13px] leading-[1.6] text-[#3a2a2d] md:text-[14px]">
              Explore fragrances for her, for him and for everyone. From bright
              citrus to rich oud, discover a scent for slow mornings, special
              evenings and the days in between.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {highlights.map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <div className="font-mono-label flex items-center gap-1.5 text-[8px] uppercase tracking-wide text-[#8a3b2a] md:text-[9px]">
                    <Icon size={11} strokeWidth={1.5} className="shrink-0" />
                    <span>{label}</span>
                  </div>
                  <p className="font-mono-label mt-2 text-[12px] md:text-[14px]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Many brands, one destination */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-[1440px] items-center gap-6 px-6 py-12 md:grid-cols-2 md:gap-10 md:px-[7%] lg:py-[3.5%]">
          <h2 className="font-script text-[clamp(38px,4vw,72px)] leading-[1.1]">
            Many brands.
            <br />
            One destination.
          </h2>
          <div className="max-w-[30em] text-[12px] leading-[1.45] text-[#2a1a1c] md:text-[13px]">
            <p>
              Discover original fragrances from international houses. GLAMORA
              brings different brands, scent families and personal favourites
              together.
            </p>
            <p className="mt-4">International brands: original fragrances.</p>
            <p className="mt-4">
              GLAMORA: carefully selected imported perfumes.
            </p>
          </div>
        </div>
      </section>

      {/* Original. Imported. Thoughtfully selected. */}
      <section className="bg-[#fff6f8]">
        <div className="mx-auto max-w-[1440px] px-6 py-10 md:px-[7%] lg:py-[3.5%]">
          <p className="font-script text-[clamp(26px,2.7vw,50px)] leading-tight text-[#f4256b]">
            Original. Imported. Thoughtfully selected.
          </p>
          <div className="mt-8 grid items-center gap-10 md:grid-cols-[1fr_1.15fr] lg:mt-12">
            <div className="flex justify-center">
              <img
                src={perfume1}
                alt="Chanel Coco Mademoiselle"
                className="h-[240px] w-auto object-contain md:h-[clamp(240px,20vw,340px)]"
              />
            </div>
            <div>
              <h3 className="font-serif text-[clamp(28px,2.9vw,52px)] font-medium leading-[1.05] text-[#5a4a4d]">
                Three ideas guide the way we
                <br className="hidden lg:block" /> select fragrances.
              </h3>
              <ul className="mt-6 space-y-4">
                {ideas.map(({ icon: Icon, title, text }) => (
                  <li key={title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#f4256b] text-[#f4256b]">
                      <Icon size={12} strokeWidth={1.5} />
                    </span>
                    <div>
                      <p className="font-serif text-[17px] leading-tight">
                        {title}
                      </p>
                      <p className="mt-1 text-[10px] text-[#6b5b5e]">{text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Details are the luxury */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1440px] px-6 py-12 md:px-[7%] lg:py-[3.5%]">
          <h2 className="text-center font-script text-[clamp(30px,2.9vw,54px)] leading-tight">
            Details are the luxury.
          </h2>
          <div className="mt-8 grid gap-12 sm:grid-cols-3 sm:gap-6 lg:mt-12">
            {details.map((d) => (
              <div key={d.label} className="mx-auto w-full max-w-[380px]">
                <div className="flex h-[260px] items-center justify-center">
                  {d.notes ? (
                    <div className="flex h-full w-full flex-col gap-2.5">
                      {notesImgs.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="min-h-0 w-full flex-1 object-cover"
                        />
                      ))}
                    </div>
                  ) : (
                    <img
                      src={d.img}
                      alt={d.alt}
                      className="max-h-full max-w-full object-contain"
                    />
                  )}
                </div>
                <p className="font-mono-label mt-5 text-[8px] uppercase tracking-wide text-[#f4256b]">
                  {d.label}
                </p>
                <p className="mt-2 text-[10px] text-[#6b5b5e]">{d.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
