import Head from "next/head";

export default function CommonHead(props: { children?: React.ReactNode }) {
  return (
    <Head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Everydle - Play every Wordle at once</title>

      <meta
        name="keywords"
        content="everydle, everythingdle, everythingle, worlde, everyle, wordle, word game, wordle unlimited, alldle, aldle, evrythingdle, evrythingle, evrydle, evryle, everythngdle, everythngle, wordle of the day, wordle hint, dordle, quordle, octordle, sedecordle, duotrigordle, sexaginta-quattordle, sexagintaquattordle, polydle, puzzle game, game, daily, wordle variant, every wordle, wordle alternative, daily game, daily wordle, wordle spinoff, daily puzzle, puzzle game, wordle clone, nyt puzzle, nyt game, browser game"
      />
      <meta
        property="description"
        content="Play every Wordle at the same time. For when Dordle, Quordle, Octordle, Sedecordle, Duotrigordle, and Sexaginta-quattordle aren't enough."
      />
      <meta name="robots" content="index, follow" />

      <meta
        property="og:title"
        content="Everydle - Play every Wordle at once"
      />
      <meta
        property="og:description"
        content="Play every Wordle at the same time. For when Dordle, Quordle, Octordle, Sedecordle, Duotrigordle, and Sexaginta-quattordle aren't enough."
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
        content="Play every Wordle at the same time. For when Dordle, Quordle, Octordle, Sedecordle, Duotrigordle, and Sexaginta-quattordle aren't enough."
      />
      <meta name="twitter:url" content="https://everydle.jakeo.dev" />
      <meta
        name="twitter:image:src"
        content="https://jakeo.dev/images/everydle-ss-1.png"
      />
      <meta property="twitter:card" content="summary_large_image" />

      {props.children}
    </Head>
  );
}
