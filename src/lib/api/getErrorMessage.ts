import type { InferType} from 'yup';
import { object, string } from 'yup';
import { hasProp } from '../types/utils';

const errorSchema = object({
  data: object({
    message: string(),
  }),
});

export type AxiosAPIError = { response: InferType<typeof errorSchema> };

const getErrorMessage = async (error: unknown) => {
  if (error && typeof error === 'object' && hasProp(error, 'response')) {
    return await errorSchema
      .validate(error.response, { abortEarly: false, stripUnknown: true })
      .then(error => error.data.message || null)
      .catch(e => {
        console.log(e);
        return null;
      });
  }
  return null;
};
export default getErrorMessage;
