
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      custom360: 360,
      custom400: 400,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;
