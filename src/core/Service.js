import { HttpErrorMessage } from "./HttpErrors";
import ServiceBase from "./ServiceBase";
import ls from "./LocalStorage";

const POST = "post";
const GET = "get";
const PUT = "put";
const DELETE = "delete";

/**
 * Service Class
 *
 * @author Brayan Rincon  <hi@bracodev.com>
 *
 * @class
 * @package Core\Services
 * @extends Core\Services\ServiceBase
 */
export default class Service extends ServiceBase {

  /**
   * Constructor
   * @constructor
   *
   * @param {String} resource Resource name
   * @param {String} storeName Store Name. Optional
   * @param {Boolean} authRequired Indicates if this endpoint is protected by authentication. Default "false". Optional
   */
  constructor (resource, storeName = false, authRequired = false) {
    super(resource, storeName, authRequired)
  } // ./constructor


  // #region Properties

  /**
   * Get additional authentication headers for Token Bearer
   *
   * @property Authentication headers
   * @readonly
   *
   * @returns {Object} Headers with Bearer Token
   */
  get headerAuth() {
    const TOKEN = ls.get("auth-token", false) || null;
    return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
  }

  // #endregion

  // #region Common

  /**
   * Execute a custom API query
   *
   * @param {String} url Server URL to use for the request
   * @param {Object} URLParams Optional URL parameters sent by GET. Optional
   * @param {String} method Request method to use when making the request. GET, PUT, POST, DELETE, and PATCH. Default: "get". Optional
   * @param {Object} data Data to be sent as the body of the request. Only applicable for 'PUT', 'POST', 'DELETE' and 'PATCH' request methods. Optional
   * @param {Object} headers Optional additional headers
   *
   * @returns {Promise} Promise
   */
  async request(url, URLParams = {}, method = GET, data = {}, headers = {}) {
    const self = this;
    let config = {
      method: method,
      url: url,//this.resource(url, URLParams),
      data: data,
      headers: headers,
    }; // cosnt

    return new Promise((resolve, reject) => {
      self
        .http(config)
        .then((response) => {
          resolve(self.processResponse(response));
        }) // then
        .catch((error) => {
          reject(self.processError(error));
        });
    }); // Promise
  } // request

  // #endregion

  // #region CRUD operations

  /**
   * Get all the stored records.
   *
   * Caution: this method can cause instability as
   * it can fetch large volumes of data in a single request
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async all(URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request(this._resource, URLParams, GET, {}, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  } // all

  /**
   * Obtain the query records in a paged form
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async paginate(URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request("", URLParams, GET, {}, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * @deprecated
   *
   * @function
   * @public
   * @async
   *
   * @param {Number|String} id Record ID
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async get(id, URLParams = {}, headers = {}) {
    try {
      if (!id) throw Error("Record ID is required");
      return await this.request(id, URLParams, GET, {}, headers);
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Get a record by your ID
   *
   * @function
   * @public
   * @async
   *
   * @param {Number|String} id Record ID
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async show(id, URLParams = {}, headers = {}) {
    try {
      if (!id) throw Error("Record ID is required");
      return new Promise((resolve, reject) => {
        this.request(id, URLParams, GET, {}, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Create a new record
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async store(data = {}, URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request(this._resource, URLParams, POST, data, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Update the data of a record by its ID
   *
   * @function
   * @public
   * @async
   *
   * @param {Number|String} id Record ID
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async update(data, URLParams = {}, headers = {}) {
    try {
      // if (!id) throw Error("Record ID is required");
      return new Promise((resolve, reject) => {
        this.request(this._resource +'/'+ data.id, URLParams, PUT, data, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Delete a record by its ID. The deleted can be HardDelete or SoftDelete.
   * If it is SoftDelete it can be recovered with the restore method.
   * To see a list of all records deleted with SoftDelete use the trash method
   *
   * @function
   * @public
   * @async
   *
   * @param {Number|String} id Record ID
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async destroy(id, URLParams = {}, headers = {}) {
    try {

      return new Promise((resolve, reject) => {
        this.request(this._resource +'/'+ id, URLParams, DELETE, {}, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Returns a list of all records deleted with SoftDelete
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async trash(URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request("trash", URLParams, GET, {}, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Returns a paginated list of all records deleted with SoftDelete
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async trashPaginate(options = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request("trash", options, GET, {}, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Restore a deleted record with SoftDelete
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async restore(data, URLParams = {}, headers = {}) {
    console.log(data);
    try {
      return new Promise((resolve, reject) => {
        this.request("trash", URLParams, PUT, data, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Delete a record permanently, this method is only used with
   * records that are in the recycle bin, that is, with SoftDelete
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async forceDelete(data, URLParams = {}, headers = {}) {
    try {
      return new Promise((resolve, reject) => {
        this.request("trash", URLParams, DELETE, data, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  /**
   * Enabled/disabled records
   *
   * @function
   * @public
   * @async
   *
   * @param {Object} data Data
   * @param {Object} URLParams Optional URL parameters through GET. Optional
   * @param {Object} headers Additional headers. Optional
   *
   * @returns {Promise<Response>} Response
   */
  async enabled(data, URLParams = {}, headers = {}) {
    const VALUE = { value: data.value };
    try {
      return new Promise((resolve, reject) => {
        this.request(`${data.id}/enabled`, URLParams, PUT, VALUE, headers)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      }); // Promise
    } catch (ex) {
      this.handleErrors(ex);
    }
  }

  // #endregion

  processResponse(response) {
    /**
     * Respuestas informativas (100–199)
     * Respuestas satisfactorias (200–299)
     * Redirecciones (300–399)
     */
    return response.data;
  }

  processError(error) {
    /**
     * Errores de los clientes (400–499)
     * Errores de los servidores (500–599).
     */
    if (error.response) {
      // Se realizó la solicitud y el servidor respondió con un código
      // de estado que cae fuera del rango de 2xx

      if (error.response.status == 500) {
        var data = error.response.data;
        var _message = `${data.message}. \nLine: ${data.line}. File: ${data.file}.`;

        return {
          status: error.response.status,
          httpError: HttpErrorMessage(error.response.status),
          data: {
            message: _message,
          },
        };
      }

      return {
        status: error.response.status,
        httpError: HttpErrorMessage(error.response.status),
        data: error.response.data,
      };
    } else if (error.request) {
      // Se hizo la solicitud pero no se recibió respuesta
      // `error.request` es una instancia de XMLHttpRequest en el navegador
      console.log(error.request);
    } else {
      // Algo sucedió al configurar la solicitud que desencadenó un error
      console.log("Error", error.message);
    }
  }
}
