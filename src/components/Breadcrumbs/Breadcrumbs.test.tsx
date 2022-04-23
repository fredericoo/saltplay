import { render } from '@testing-library/react';
import Breadcrumbs from '.';

describe('Breadcrumbs component', () => {
  test('Given a list of items with no hrefs, then renders 0 links', () => {
    const items = [{ label: 'Item 1' }, { label: 'Item 2' }];

    const { container } = render(<Breadcrumbs levels={items} />);

    const links = container.querySelectorAll('a');
    expect(links.length).toBe(0);
  });

  test("Given a list of items with hrefs, then renders the items' labels as links", () => {
    const items = [
      { label: 'Item 1', href: '/item1' },
      { label: 'Item 2', href: '/item2' },
    ];

    const { container } = render(<Breadcrumbs levels={items} />);

    const links = container.querySelectorAll('a');
    expect(links.length).toBe(2);
    expect(links[0].textContent).toBe('Item 1');
    expect(links[0].getAttribute('href')).toBe('/item1');
    expect(links[1].textContent).toBe('Item 2');
    expect(links[1].getAttribute('href')).toBe('/item2');
  });

  test('Given a list of N elements, renders N-1 Chevron Icons', () => {
    const randomArray = Array.from({ length: Math.floor(Math.random() * 10) }, () => Math.floor(Math.random() * 10));

    const items = randomArray.map(i => ({ label: 'Item 1', href: '/item1' }));

    const { container } = render(<Breadcrumbs levels={items} />);

    const chevrons = container.querySelectorAll('svg');
    expect(chevrons.length).toBe(Math.max(0, randomArray.length - 1));
  });
});
