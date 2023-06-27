import HttpClient from "./HttpClient";
import config from "@/config";
import ls from "./LocalStorage";

const API_URL = config.app.apiURL; // process.env.API_URL,
const API_VERSION = config.app.apiVersion; // process.env.API_VERSION;

export default class ServiceBase {
  /**
   * @param {String} resource Service provider
   * @private
   **/
  _resource;

  /**
   * @param {String} storeName Module name in the store
   * @private
   **/
  _storeName;

  /**
   * @param {Boolean} authRequired Required auth
   * @private
   **/
  _authRequired = false;

  _baseUrl;

  _apiVersion;

  _csrfToken;

  _lastQuery;

  _http;

  /**
   * Constructor
   * @constructor
   *
   * @param {String} resource Services provider name
   * @param {String} storeName Store Name. Optional
   * @param {Boolean} authRequired Indicates if this endpoint is protected by authentication. Default "false". Optional
   */
  constructor(resource, storeName = false, authRequired = false) {
    this._resource = resource;
    this._storeName = storeName || resource;
    this._authRequired = authRequired;

    this._apiVersion = API_VERSION;
    this._baseUrl =
      this.trailingSlash(API_URL) + this.trailingSlash(API_VERSION);

    this._http = HttpClient.http;
    this._http.defaults.baseURL = this._baseUrl;

    this.checkToken();
  }

  /**
   *
   */
  checkToken() {
    const authToken = ls.get("auth-token", false) || false;
    if (authToken) {
      HttpClient.addDefaultHeader("Authorization", `Bearer ${authToken}`);
    }
  }

  /**
   *
   */
  get http() {
    return this._http;
  }

  /**
   *
   */
  set http(value) {
    return this._http(value);
  }

  /**
   *
   * @param {String} url Server URL to use for the request
   * @param {Object} params Optional URL parameters sent by GET. Optional
   * @returns
   */
  resource(url = "", params = {}) {
    this._lastQuery = url;
    const p = this.createParamsURL(params);
    return `${this.resource}/${url}${p}`;
  }

  /**
   *
   * @param {Object} params
   * @returns
   */
  createParamsURL(params) {
    let _params = "";

    if (params != null) {
      _params = "?";
      for (const [key, value] of Object.entries(params)) {
        if (value) _params += `${key}=${value}&`;
      }
    }

    return _params.substring(0, _params.length - 1);
  }

  /**
   * Handle Errors
   * @param {*} error
   */
  handleErrors(error) {
    const ex = {
      service: this._resource,
      lastUrl: this._lastQuery,
      exception: error,
    };
    console.log(ex); // console
    return ex;
  }

  trailingSlash(str) {
    return str.endsWith("/") ? str : str + "/";
  }
}
