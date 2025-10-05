"use client";

import { useEffect, useState } from "react";

import Head from "next/head";

import { randomElement } from "@/utility";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
  const [subtitle, setSubtitle] = useState<string>("");

  /* set random subtitle */

  useEffect(() => {
    setSubtitle(
      randomElement([
        `Always solve on the first guess`,
        `Save over 2,000 days of your time`,
        `Every wordle everywhere all at once`,
        `It's your fault if something crashes`,
        `Never worry about missing a day again`,
        `It's the same thing every day`,
        `"basically re-type the wordle word list with an increasingly unuseable UI"`,
        `"oh it gets worse 200 words in"`,
        `"NONONONONOONO, get it away from me!"`,
        `"increasingly onerous"`,
        `"wonderfully stupid"`,
        `"made me feel slightly queasy"`,
      ]),
    );
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Everydle - Play every Wordle at once</title>

        <meta
          name="keywords"
          content="everydle, wordle, word game, wordle unlimited, wordle of the day, wordle hint, dordle, quordle, octordle, sedecordle, duotrigordle, sexaginta-quattordle, sexagintaquattordle, polydle, puzzle game, game, daily, wordle variant, every wordle, wordle alternative, daily game, daily wordle, wordle spinoff, daily puzzle, puzzle game, wordle clone, nyt puzzle, nyt game, browser game"
        />
        <meta
          property="description"
          content="Play every Wordle at once in one extremely long sitting, and never worry about missing a day again."
        />

        <meta
          property="og:title"
          content="Everydle - Play every Wordle at once"
        />
        <meta
          property="og:description"
          content="Play every Wordle at once in one extremely long sitting, and never worry about missing a day again."
        />
        <meta name="theme-color" content="#00c951" />
        <meta property="og:url" content="https://everydle.jakeo.dev" />
        <meta
          property="og:image"
          content="https://jakeo.dev/images/everydle-ss-1.png"
        />

        <meta
          name="twitter:title"
          content="Everydle - Play every Wordle at once"
        />
        <meta
          name="twitter:description"
          content="Play every Wordle at once in one extremely long sitting, and never worry about missing a day again."
        />
        <meta name="twitter:url" content="https://everydle.jakeo.dev" />
        <meta
          name="twitter:image:src"
          content="https://jakeo.dev/images/everydle-ss-1.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
      </Head>

      <div className="flex h-screen items-center justify-center px-8">
        <div>
          <h1 className="text-6xl font-black md:text-9xl">Everydle</h1>
          <h2 className="mt-3 text-xl font-medium text-pretty text-gray-800 md:text-2xl">
            The unoriginal 5-letter word-guessing game
          </h2>
          <h3 className="mt-2 text-base font-medium text-pretty text-gray-700 italic md:text-lg">
            {subtitle}
          </h3>

          <Link
            className="mx-auto mt-8 block w-4/5 rounded-full bg-gray-900 px-4 py-2 text-lg text-gray-100 transition hover:bg-gray-700 active:bg-gray-800 md:w-2/3 md:py-3 md:text-xl"
            href="/play"
          >
            Play
          </Link>

          <div className="mt-4 flex items-center justify-center text-sm">
            <a
              className="transition hover:drop-shadow-md active:drop-shadow-none"
              href="https://jakeo.dev"
              target="_blank"
            >
              <img
                src="https://www.jakeo.dev/logos/bunny-jakeo-wordmark.png"
                className="w-[3.75rem]"
              />
            </a>
            <span className="mx-2.5">•</span>
            <a
              className="transition hover:text-blue-600"
              href="https://github.com/jakeo-dev/everydle"
              target="_blank"
            >
              <FontAwesomeIcon icon={faGithub} className="mr-1" aria-hidden />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
