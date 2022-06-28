import { gen } from '@/lib/testUtils';
import { render, screen } from '@testing-library/react';
import Breadcrumbs from '.';

describe('Breadcrumbs component', () => {
  test('given a list of items, renders all but last item as links', () => {
    const items = [...Array(gen.int(2, 10))].map(() => ({ label: gen.string(), href: `/${gen.string()}` }));

    render(<Breadcrumbs levels={items} />);

    const breadcrumbs = screen.getAllByTestId('breadcrumb');
    const links = screen.getAllByRole('link');

    expect(links).toHaveLength(items.length - 1);
    links.forEach((link, i) => expect(link).toHaveTextContent(items[i].label));

    expect(breadcrumbs).toHaveLength(items.length);
  });

  test('renders separators between items', () => {
    const items = [...Array(gen.int(2, 10))].map(() => ({ label: gen.string(), href: `/${gen.string()}` }));

    render(<Breadcrumbs levels={items} />);

    const chevrons = screen.getAllByRole('presentation');
    expect(chevrons.length).toBe(Math.max(0, items.length - 1));
  });

  test('renders aria-current="page" on last element', () => {
    const items = [...Array(gen.int(2, 10))].map(() => ({ label: gen.string(), href: `/${gen.string()}` }));

    render(<Breadcrumbs levels={items} />);

    const breadcrumbs = screen.getAllByTestId('breadcrumb');
    const lastElement = breadcrumbs[breadcrumbs.length - 1];

    expect(lastElement).toHaveAttribute('aria-current', 'page');
  });
});
