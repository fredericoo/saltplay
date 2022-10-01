import { formatDateTime } from '@/lib/utils';
import type { ChakraProps } from '@chakra-ui/react';
import { HStack, Input, Popover, PopoverContent, PopoverTrigger, Text } from '@chakra-ui/react';
import {
  Calendar,
  CalendarControls,
  CalendarDays,
  CalendarMonth,
  CalendarMonthName,
  CalendarMonths,
  CalendarNextButton,
  CalendarPrevButton,
  CalendarWeek,
} from '@uselessdev/datepicker';
import { useState } from 'react';

type DateTimeProps = ChakraProps & {
  defaultValue?: string;
  autoFocus?: boolean;
  align: 'left' | 'right';
  name: string;
  label?: string;
};

const DateTime: React.FC<DateTimeProps> = ({ defaultValue, name, autoFocus, align, label, ...props }) => {
  const [value, setValue] = useState<Date>(() => (defaultValue ? new Date(defaultValue) : new Date()));
  const [isOpen, setIsOpen] = useState(autoFocus === true);

  return (
    <HStack justify={align === 'right' ? 'flex-end' : 'flex-start'} flexGrow="1">
      {label && (
        <Text px={2} color="grey.9" as="label" htmlFor={name}>
          {label}
        </Text>
      )}
      <Input
        {...props}
        textAlign="center"
        type="hidden"
        autoComplete="off"
        value={value.toISOString()}
        name={name}
        borderColor={isOpen ? 'grey.10' : undefined}
      />
      <Popover
        isOpen={isOpen}
        returnFocusOnClose={false}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        placement={align === 'right' ? 'bottom-end' : 'bottom-start'}
      >
        <PopoverTrigger>
          <Text>{formatDateTime(value)}</Text>
        </PopoverTrigger>
        <PopoverContent zIndex="overlay">
          <Calendar
            value={{ start: value }}
            onSelectDate={calendarDay => calendarDay instanceof Date && setValue(calendarDay)}
            singleDateSelection
          >
            <CalendarControls>
              <CalendarPrevButton />
              <CalendarNextButton />
            </CalendarControls>

            <CalendarMonths>
              <CalendarMonth>
                <CalendarMonthName />
                <CalendarWeek />
                <CalendarDays />
              </CalendarMonth>
            </CalendarMonths>
          </Calendar>
        </PopoverContent>
      </Popover>
    </HStack>
  );
};

export default DateTime;
