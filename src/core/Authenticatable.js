import Service from "./Service";
import ls from "./LocalStorage";

/**
 * Service Class
 *
 * @author Brayan Rincon  <hi@bracodev.com>
 *
 * @class
 * @package Core\Services
 * @extends Core\Services\Service
 */
export class Authenticatable extends Service {
  /**
   * Constructor
   * @param {String} resource Nombre del Servicio/Endpoint
   * @param {String} store Opcional. Nombre del módulo en el store
   */
  constructor(resource) {
    super(resource);
  }

  /**
   * Change the password
   * @param {User} user User data
   * @returns
   */
  async forgotPassword(user) {
    return await this.request(`${user.id}/forgot-password`, {}, "get");
  }

  async resetPassword(user) {
    return await this.request(`${user.id}/reset-password`, {}, "get", {
      value: user.password,
    });
  }

  /**
   * Retorna los productos en oferta por orden alfabetico
   * @param {Number} count Determina la cantidad de productoss
   * @returns
   */
  async login(credential = {}) {
    return this.request("sanctum/csrf-cookie", {}, "get").then((response) => {
      return this.request("api/login", {}, "post", credential).then(
        (response) => {
          ls.set('auth', true)
          ls.set('token', response.data.token)
          return response
        }
      );
    });
  }

  async logout() {
    return this.request("api/logout", {}, "post").then(() => {
      ls.clear()
    });
  }

}
