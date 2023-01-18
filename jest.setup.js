import '@testing-library/jest-dom';
import '@testing-library/jest-dom/extend-expect';

// eslint-disable-next-line no-undef
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '',
      query: '',
      asPath: '',
    };
  },
}));

if (!SVGElement.prototype.getTotalLength) {
  SVGElement.prototype.getTotalLength = () => 1;
}
