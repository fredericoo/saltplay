import getErrorMessage, { AxiosAPIError } from './getErrorMessage';

describe('getErrorMessage', () => {
  test("If error doesn't have message, returns null", async () => {
    expect(await getErrorMessage(new Error())).toBe(null);
  });

  test('If error matches validation schema, returns its message', async () => {
    const error: AxiosAPIError = { response: { data: { message: 'Poof' } } };
    expect(await getErrorMessage(error)).toBe('Poof');
  });
});
