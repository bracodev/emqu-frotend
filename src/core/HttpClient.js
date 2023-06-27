import axios from "axios";
import config from "@/config";

const Axios = axios.create(config.http);

export default class HttpClient {
  static #http = Axios;

  static get http() {
    return this.#http;
  }

  /**
   * Add header to Axios interceptor
   * @param {String} key Header
   * @param {*} value
   */
  static addDefaultHeader(key, value) {
    this.#http.interceptors.request.use(
      function (config) {
        config.headers[key] = value;
        return config;
      },
      function (err) {
        return Promise.reject(err);
      }
    );
  }
}
