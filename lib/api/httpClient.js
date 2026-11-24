import axios from 'axios';

import { HttpError } from './httpError';

/**
 * Return the Axios response. Feature API modules interpret the response contract.
 * Network and abort errors propagate unchanged.
 */
export async function httpClient(url, options) {
  try {
    return await axios.request({ ...options, url });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new HttpError(error.response);
    }
    throw error;
  }
}
