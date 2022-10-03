import { popoverAnatomy as parts } from '@chakra-ui/anatomy';
import type { PartsStyleFunction, SystemStyleFunction, SystemStyleObject } from '@chakra-ui/theme-tools';
import { cssVar, mode } from '@chakra-ui/theme-tools';

const $popperBg = cssVar('popper-bg');

const $arrowBg = cssVar('popper-arrow-bg');
const $arrowShadowColor = cssVar('popper-arrow-shadow-color');

const baseStylePopper: SystemStyleObject = {
  zIndex: 10,
};

const baseStyleContent: SystemStyleFunction = props => {
  const bg = mode('white', 'grey.1')(props);
  const shadowColor = mode('grey.3', 'whiteAlpha.300')(props);

  return {
    [$popperBg.variable]: `colors.${bg}`,
    bg: $popperBg.reference,
    [$arrowBg.variable]: $popperBg.reference,
    [$arrowShadowColor.variable]: `colors.${shadowColor}`,
    width: 'xs',
    border: '1px solid',
    borderColor: 'grey.6',
    borderRadius: 'lg',
    boxShadow: 'lg',
    zIndex: 'inherit',
    _focus: {
      outline: 0,
      boxShadow: 'lg',
    },
  };
};

const baseStyleHeader: SystemStyleObject = {
  px: 3,
  py: 2,
  borderBottomWidth: '1px',
};

const baseStyleBody: SystemStyleObject = {
  px: 3,
  py: 2,
};

const baseStyleFooter: SystemStyleObject = {
  px: 3,
  py: 2,
  borderColor: 'grey.4',
  borderTopWidth: '1px',
};

const baseStyleCloseButton: SystemStyleObject = {
  position: 'absolute',
  borderRadius: 'md',
  top: 1,
  insetEnd: 2,
  padding: 2,
};

const baseStyle: PartsStyleFunction = props => ({
  popper: baseStylePopper,
  content: baseStyleContent(props),
  header: baseStyleHeader,
  body: baseStyleBody,
  footer: baseStyleFooter,
  arrow: {},
  closeButton: baseStyleCloseButton,
});

const Popover = {
  parts: parts.keys,
  baseStyle,
};

export default Popover;
