import Marquee from "react-fast-marquee";
import { useEffect, useState } from "react";
import { shuffle } from "@/utility";

function Footer() {
  // number of quotes must be even to make the marquee correct coloring
  const quotes = [
    `"basically 're-type the wordle word list with an increasingly unuseable UI'"`,
    `"oh it gets worse 200 words in"`,
    `"NONONONONOONO, get it away from me!"`,
    `"increasingly onerous"`,
    `"wonderfully stupid"`,
    `"made me feel slightly queasy"`,
    `"very funny"`,
    `"HORRIBLE"`,
    `"evil work"`,
    `"una declaración de guerra a tu tiempo libre"`,
  ];

  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    width && (
      <div
        className={`${width >= 768 && "fade-edges"} absolute bottom-0 w-full`}
      >
        <Marquee className="py-2" speed={20} pauseOnHover>
          {shuffle(quotes).map((quote, i) => {
            return (
              <span
                key={i}
                className={`-ml-4.5 px-8 py-8 text-base italic md:text-lg ${i % 2 ? "slanted-highlight-dark text-white" : "slanted-highlight-light"}`}
              >
                {quote}
              </span>
            );
          })}
        </Marquee>
      </div>
    )
  );
}

export default Footer;
