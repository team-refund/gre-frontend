/** HTTP failures retain the response for inspecting backend error data. */
export class HttpError extends Error {
  constructor(response) {
    super(`HTTP ${response.status}`);
    this.name = 'HttpError';
    this.status = response.status;
    this.response = response;
    const payload = response.data;
    this.code = typeof payload?.code === 'string' ? payload.code : null;
    this.action = typeof payload?.action === 'string' ? payload.action : null;
    this.fieldErrors = Array.isArray(payload?.fieldErrors) ? payload.fieldErrors : null;
    this.retryable = payload?.retryable === true;
  }
}
