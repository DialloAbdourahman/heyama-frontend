import axios from "axios";
import { KEYS } from "../utils/keys";

export const axiosBaseClient = axios.create({
  baseURL: KEYS.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
