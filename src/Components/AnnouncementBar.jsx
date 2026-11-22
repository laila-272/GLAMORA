const messages = [
  "Free delivery over EGP 2,000",
  "Easy 14-day returns",
  "Cash on delivery available",
];

export default function AnnouncementBar() {
  return (
    <div className="bg-[#2a1a1c] text-white">
      <div className="mx-auto flex h-6 max-w-[1945px] items-center justify-between px-4 text-[10px] tracking-wide md:px-10">
        {messages.map((m, i) => (
          <span
            key={m}
            className={
              i === 1 ? "hidden sm:block" : i === 2 ? "hidden md:block" : ""
            }
          >
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
