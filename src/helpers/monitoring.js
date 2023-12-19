import { nearConfig } from './nearConfig';

class MonitoringService {
  #backendUrl;
  constructor() {
    this.#backendUrl = nearConfig.backendUrl;
  }

  async getGrafanaToken(token) {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const data = await fetch(
        `${this.#backendUrl}get-grafana-token`,
        requestOptions
      );
      return await data.json();
    } catch (e) {
      return e;
    }
  }

  async isExistsGrafanaToken(token) {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };
      const data = await fetch(
        `${this.#backendUrl}is-exists-grafana-token`,
        requestOptions
      );
      return data.status === 200;
    } catch (e) {
      return e;
    }
  }

  async checkGrafanaUrl(token) {
    try {
      const data = await fetch(
        `${process.env.REACT_APP_GRAFANA_URL}?auth_token=${token}`,
        { redirect: 'manual' }
      );
      return data.status === 200;
    } catch (e) {
      console.log(e);
      return true;
    }
  }
}

export const monitoringService = new MonitoringService();

