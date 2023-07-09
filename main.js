import axios from "axios";
import * as cheerio from "cheerio";
import * as csv from "csv-stringify";
import * as fs from "fs";
import _ from "lodash";

const extractMovie = (platformName) => {
  const currentYear = 2023;
  const streamingPlatformUrl = `https://www.filmweb.pl/ranking/vod/${platformName}/film/${currentYear}`;
  return axios.get(streamingPlatformUrl).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);
    const movies = [...$(".rankingType__card")].map((e) => {
      const extractedTitle = $(e).find(".rankingType__title").text().trim();
      const extractedRating = $(e)
        .find(".rankingType__rate--value")
        .text()
        .trim()
        .replace(",", ".");
      return {
        title: extractedTitle,
        rating: parseFloat(extractedRating),
        platform: platformName,
      };
    });

    let maxLimit = movies.length > 10 ? 10 : movies.length;
    return movies.slice(0, maxLimit);
  });
};

const deduplicateAndSortByRating = (movies) => {
  const sortedMovies = [];
  const moviesGroupByTitle = _.groupBy(movies, "title");
  _.each(moviesGroupByTitle, (value, key) => {
    let hghestRatingMovie;

    if (value.length > 1) {
      hghestRatingMovie = _.maxBy(value, "rating");
    } else {
      hghestRatingMovie = value[0];
    }

    if (
      sortedMovies.length > 0 &&
      hghestRatingMovie.rating > sortedMovies[0][2]
    ) {
      sortedMovies.unshift([
        hghestRatingMovie.title,
        hghestRatingMovie.platform,
        hghestRatingMovie.rating,
      ]);
    } else {
      sortedMovies.push([
        hghestRatingMovie.title,
        hghestRatingMovie.platform,
        hghestRatingMovie.rating,
      ]);
    }
  });

  return sortedMovies;
};

const netflixPromise = extractMovie("netflix");
const hboPromise = extractMovie("hbo_max");
const disneyPromise = extractMovie("disney");
const canalPlusPromise = extractMovie("canal_plus_manual");
let allPromises = [netflixPromise, hboPromise, disneyPromise, canalPlusPromise];

Promise.all(allPromises).then((res) => {
  let allMovies = [...res[0], ...res[1], ...res[2], ...res[3]];
  let deduplicatedMovies = deduplicateAndSortByRating(allMovies);
  deduplicatedMovies.unshift(["Title", "VOD", "rating"]);
  csv.stringify(deduplicatedMovies, (e, o) =>
    fs.writeFileSync("result.csv", o)
  );
});
