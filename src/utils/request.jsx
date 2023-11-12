import axios from "axios";
import Cookies from "js-cookie";
import config from "../config.json";

const { API_URL } = config;
const apiKey = Cookies.get("apiKey");

const request = axios.create({
  baseURL: API_URL,
  headers: { "X-Api-Key": apiKey },
});

export default request;
