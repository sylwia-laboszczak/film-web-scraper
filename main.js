import axios from "axios";
import * as cheerio from "cheerio";
import * as csv from "csv-stringify";
import * as fs from "fs";

var allMovies = [];

async function extractMovie(streamingPlatformUrl, platformName) {
  const response = await axios.get(streamingPlatformUrl);
  const html = response.data;

  // Use Cheerio to parse the HTML
  const $ = cheerio.load(html);

  // Select all the elements with the class name "athing"
  const movies = [...$(".rankingType__card")].map((e) => {
    return {
      title: $(e).find(".rankingType__title").text().trim(),
      rating: $(e)
        .find(".rankingType__rate--value")
        .text()
        .trim()
        .replace('"', "")
        .replace(',', "."),
      platform: platformName,
    };
  });

  let maxLimit = movies.length > 10 ? 10 : movies.length;
  console.log(platformName + " " + maxLimit);
  // Loop through the selected elements
  for (let index = 0; index < maxLimit; index++) {
    const movie = movies[index];
    const title = movie.title;
    const rating = movie.rating;
    // Log each article's text content to the console
    // console.log(index + 1 + " " + platformName + " " + title + " " + rating);
    allMovies.push([title, platformName, parseFloat(rating)]);
  }
}

await extractMovie(
  "https://www.filmweb.pl/ranking/vod/netflix/film/2023",
  "NETFLIX"
);
await extractMovie(
  "https://www.filmweb.pl/ranking/vod/hbo_max/film/2023",
  "HBO"
);
await extractMovie(
  "https://www.filmweb.pl/ranking/vod/disney/film/2023",
  "DISNEY"
);
await extractMovie(
  "https://www.filmweb.pl/ranking/vod/canal_plus_manual/film/2023",
  "CANAL PLUS"
);

allMovies.sort((a, b) => b[2] - a[2]);
allMovies.unshift(["Title", "VOD", "rating"]);
csv.stringify(allMovies, (e, o) => fs.writeFileSync("result.csv", o));