import axios from "axios";
import * as cheerio from "cheerio";
import * as csv from "csv-stringify";
import * as fs from "fs";

function extractMovie(streamingPlatformUrl, platformName) {
  return axios.get(streamingPlatformUrl).then((response) => {
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
          .replace(",", "."),
        platform: platformName,
      };
    });

    let maxLimit = movies.length > 10 ? 10 : movies.length;
    // console.log(platformName + " " + maxLimit);
    // Loop through the selected elements

    let platformSpecificMovies = [];

    for (let index = 0; index < maxLimit; index++) {
      const movie = movies[index];
      const title = movie.title;
      const rating = movie.rating;
      // Log each article's text content to the console
      // console.log(index + 1 + " " + platformName + " " + title + " " + rating);
      platformSpecificMovies.push([title, platformName, parseFloat(rating)]);
    }
    return platformSpecificMovies;
  });
}

const netflixPromise = extractMovie(
  "https://www.filmweb.pl/ranking/vod/netflix/film/2023",
  "netflix"
);
const hboPromise = extractMovie(
  "https://www.filmweb.pl/ranking/vod/hbo_max/film/2023",
  "hbo_max"
);
const disneyPromise = extractMovie(
  "https://www.filmweb.pl/ranking/vod/disney/film/2023",
  "disney"
);
const canalPlusPromise = extractMovie(
  "https://www.filmweb.pl/ranking/vod/canal_plus_manual/film/2023",
  "canal_plus_manual"
);

let allPromises = [netflixPromise, hboPromise, disneyPromise, canalPlusPromise];

Promise.all(allPromises).then((res) => {
  let allMovies = [...res[0], ...res[1], ...res[2], ...res[3]];
  console.log(allMovies);

  allMovies.sort((a, b) => b[2] - a[2]);
  allMovies.unshift(["Title", "VOD", "rating"]);
  csv.stringify(allMovies, (e, o) => fs.writeFileSync("result.csv", o));
});
