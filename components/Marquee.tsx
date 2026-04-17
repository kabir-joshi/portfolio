"use client";

const items = [
  "Marathon",
  "Cross Country",
  "Track & Field",
  "Finish Line",
  "Golden Hour",
  "Race Day",
  "Start Line",
  "Personal Record",
  "Sprint",
  "Road Racing",
];

export default function Marquee() {
  return (
    <div className="overflow-hidden border-y border-white/[0.04] light:border-black/[0.04] py-4 select-none marquee-wrapper">
      <div className="flex whitespace-nowrap animate-marquee">
        {[0, 1].map((copy) => (
          <span key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center gap-10 mx-10 text-xs font-mono text-white/20 light:text-black/20 tracking-[0.3em] uppercase"
              >
                {item}
                <span className="text-white/10 light:text-black/10 text-[10px]">◆</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}
