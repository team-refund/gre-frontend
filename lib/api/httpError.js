/** HTTP failures retain the response for inspecting backend error data. */
export class HttpError extends Error {
  constructor(response) {
    super(`HTTP ${response.status}`);
    this.name = 'HttpError';
    this.status = response.status;
    this.response = response;
  }
}
