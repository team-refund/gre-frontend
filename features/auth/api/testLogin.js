import { httpClient } from '@/lib/api/httpClient';

export async function testLogin(loginId) {
  const response = await httpClient('/api/dev/test-login', {
    method: 'POST',
    data: { loginId },
  });

  if (response.status !== 204) {
    throw new Error('Unexpected test login response.');
  }
}
