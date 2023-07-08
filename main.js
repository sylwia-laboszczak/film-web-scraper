import axios from "axios";

const response = await axios.get("https://news.ycombinator.com/");
const html = response.data;
console.log(html);

