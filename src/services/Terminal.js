import Service from '@/core/Service'

/**
 * Users Services
 *
 * @author Brayan Rincon <brayan262@gmail.com>
 * @extends Authenticatable
 * @version 1.0.0
 *
 */
export default class Terminal extends Service {
  constructor () {
    super('api/terminals')
  }

  async ping (id) {
    return this.request(`api/terminals/${id}/ping`, {}, 'get').then((response) => response);
  }

  async logs (id) {
    return this.request(`api/terminals/${id}/logs`, {}, 'get').then((response) => response);
  }

  async pingAll () {
    return this.request(`api/terminals/ping`, {}, 'get').then((response) => response);
  }

}
