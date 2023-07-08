import axios from "axios";
import * as cheerio from "cheerio";

async function extractMovie(streamingPlatformUrl, platformName) {
  const response = await axios.get(streamingPlatformUrl);
  const html = response.data;

  // Use Cheerio to parse the HTML
  const $ = cheerio.load(html);

  // Select all the elements with the class name "athing"
//   const movies = $(".rankingType__card");
  const movies = [...$(".rankingType__card")].map((e) => {
    return {
      title: $(e).find(".rankingType__title").text().trim(),
      rating: $(e).find(".rankingType__rate--value").text().trim(),
      platform: platformName
    };
  });

  // Loop through the selected elements
  for (let index = 0; index < 10; index++) {
    const movie = movies[index];
    const title = movie.title
    const rating = movie.rating
    // Log each article's text content to the console
    console.log(index+1 +" "+platformName + " " + title + " " + rating);
  }
}

await extractMovie(
  "https://www.filmweb.pl/ranking/vod/netflix/film/",
  "NETFLIX"
);
// await extractMovie("https://www.filmweb.pl/ranking/vod/hbo_max/film","HBO");
// await extractMovie("https://www.filmweb.pl/ranking/vod/disney/film","DISNEY");
// await extractMovie("https://www.filmweb.pl/ranking/vod/canal_plus_manual/film","CANAL PLUS");
