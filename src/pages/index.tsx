"use client";

import CommonHead from "@/components/CommonHead";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCookie, faCookieBite } from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

export default function Landing() {
  return (
    <>
      <CommonHead />

      <div className="flex h-screen items-center justify-center px-8">
        <div>
          <Image
            src="/everydle.png"
            alt="Everydle logo"
            width="100"
            height="100"
            className="mx-auto w-16 md:w-28"
          />

          <h1 className="mt-2 text-5xl font-black md:text-8xl">Everydle</h1>
          <h2 className="mt-4 text-lg font-medium text-pretty text-neutral-800 md:text-2xl">
            The unoriginal 5-letter word-guessing game
          </h2>
          {/* <h3 className="mt-2 text-base font-medium text-pretty text-neutral-700 italic md:text-lg">
            {subtitle}
          </h3> */}

          <Link
            className="mx-auto mt-8 block w-4/5 rounded-full bg-neutral-900 px-4 py-2 text-lg text-neutral-100 transition hover:bg-neutral-700 active:bg-neutral-800 md:w-2/3 md:py-3 md:text-xl"
            href="/play"
          >
            Play
          </Link>

          <div className="mt-8 flex items-center justify-center text-sm">
            <a
              className="-mr-1.5 transition hover:drop-shadow-md active:drop-shadow-none"
              href="https://jakeo.dev"
              target="_blank"
              rel="noopener"
            >
              <img
                src="https://www.jakeo.dev/logos/jakeo-wordmark.png"
                className="w-13"
              />
            </a>
            <span className="mx-2 text-neutral-400">•</span>
            <a
              className="group transition hover:text-blue-600"
              href="https://buymeacoffee.com/jakeorchanian"
              target="_blank"
              rel="noopener"
            >
              <div className="mr-1 inline">
                <FontAwesomeIcon
                  icon={faCookieBite}
                  className="visible text-neutral-500 group-hover:invisible group-hover:w-0"
                  aria-hidden
                />
                <FontAwesomeIcon
                  icon={faCookie}
                  className="invisible w-0 text-blue-400 group-hover:visible group-hover:w-auto"
                  aria-hidden
                />
              </div>
              <span>Buy me a cookie</span>
            </a>
            <span className="mx-2 text-neutral-400">•</span>
            <a
              className="group transition hover:text-blue-600"
              href="https://github.com/jakeo-dev/everydle"
              target="_blank"
              rel="noopener"
            >
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
