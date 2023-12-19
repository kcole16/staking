import { nearConfig } from './nearConfig';
import { Buffer } from 'buffer';

class AuthService {
  #backendUrl;
  constructor() {
    this.#backendUrl = nearConfig.backendUrl;
  }

  async signup(email, password) {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
        }),
      };
      const data = await fetch(`${this.#backendUrl}register`, requestOptions);
      return await data.json();
    } catch (e) {
      return e;
    }
  }

  async login(values) {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
        }),
      };
      const data = await fetch(`${this.#backendUrl}login`, requestOptions);
      return await data.json();
    } catch (e) {
      return e;
    }
  }
  async checkToken(token) {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const data = await fetch(
        `${this.#backendUrl}auth/check-token`,
        requestOptions
      );
      if (data.status !== 200) {
        throw new Error(data.status);
      }
      return await data.json();
    } catch (e) {
      return { status: 'fail', message: 'Unauthorized' };
    }
  }

  async refreshToken(token) {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const data = await fetch(
        `${this.#backendUrl}auth/refresh-token`,
        requestOptions
      );
      if (data.status !== 200) {
        throw new Error(data.status);
      }
      return await data.json();
    } catch (e) {
      return { status: 'fail', message: 'Unauthorized' };
    }
  }
  async resendConfirmMail(email) {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      };

      const data = await fetch(
        `${this.#backendUrl}auth/resend-confirmation-code`,
        requestOptions
      );
      if (data.status !== 200) throw new Error(data.status);
      return await data.json();
    } catch (message) {
      return { status: 'fail', message };
    }
  }

  async confirmEmail(email, token) {
    try {
      const requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const data = await fetch(
        `${this.#backendUrl}auth/confirmation/${email}/${token}`,
        requestOptions
      );
      return await data.json();
    } catch (message) {
      return message;
    }
  }

  async resetPassword(email) {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      };

      const data = await fetch(
        `${this.#backendUrl}auth/forgot-password`,
        requestOptions
      );
      return await data.json();
    } catch (message) {
      return message;
    }
  }

  async setNewPassword(email, token, newPassword) {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword }),
      };

      const data = await fetch(
        `${this.#backendUrl}auth/change-password/${email}/${token}`,
        requestOptions
      );
      return await data.json();
    } catch (message) {
      return message;
    }
  }
  getRemainingTime(token) {
    const tokenParts = token.split('.');
    const decodedToken = JSON.parse(
      Buffer.from(tokenParts[1], 'base64').toString('utf-8')
    );
    const expirationTime = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return expirationTime - currentTime;
  }
}

export const authService = new AuthService();

