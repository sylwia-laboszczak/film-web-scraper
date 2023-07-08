import axios from "axios";
import * as cheerio from "cheerio";

const response = await axios.get("https://news.ycombinator.com/");
const html = response.data;

// Use Cheerio to parse the HTML
const $ = cheerio.load(html);

// Select all the elements with the class name "athing"
const articles = $(".athing");

// Loop through the selected elements
for (const article of articles) {
	const text = $(article).text().trim();
    // Log each article's text content to the console
    console.log(text);
}
