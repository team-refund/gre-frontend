import { HttpError } from "./httpError";

/**
 * Return the native Response; feature API modules own response parsing.
 * Pass through fetch options, including signal and Next.js cache options.
 * Network and abort errors propagate unchanged.
 */
export async function httpClient(input, options) {
  const response = await fetch(input, options);

  if (!response.ok) {
    throw new HttpError(response);
  }

  return response;
}
