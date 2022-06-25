export const Calendar = {
  Calendar: {
    parts: ['calendar'],

    baseStyle: {
      calendar: {
        display: 'block',
        p: '2',
        borderRadius: 'lg',
        boxShadow: 'md',
      },
    },
  },
  CalendarMonth: {
    parts: ['name', 'days', 'week', 'days'],
    baseStyle: {
      name: {
        fontSize: 'lg',
        py: '2',
        px: '1',
        textAlign: 'center',
      },
      days: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
      },
      week: {
        textAlign: 'center',
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
      },
    },
  },
  CalendarDay: {
    baseStyle: {
      borderRadius: 'none',
    },
  },
  CalendarControl: {
    parts: ['button'],

    baseStyle: {
      button: {
        h: 6,
        px: 2,
        flex: '1',
        bg: 'transparent',
      },
    },
  },
};
