import axios from "axios";
import * as cheerio from "cheerio";

async function extractMovie(streamingPlatformUrl) {
  const response = await axios.get(streamingPlatformUrl);
  const html = response.data;

  // Use Cheerio to parse the HTML
  const $ = cheerio.load(html);

  // Select all the elements with the class name "athing"
  const movies = $(".rankingType__title");

  // Loop through the selected elements
  for (let index = 0; index < 10; index++) {
    const movie = movies[index];
    const text = $(movie).text().trim();
    // Log each article's text content to the console
    console.log(index+1  + " " + text);
  }

}

await extractMovie("https://www.filmweb.pl/ranking/vod/netflix/film/");
// await extractMovie("https://www.filmweb.pl/ranking/vod/hbo_max/film");
// await extractMovie("https://www.filmweb.pl/ranking/vod/disney/film");
