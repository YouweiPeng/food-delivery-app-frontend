import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme/theme.js'; 
import { configureStore } from '@reduxjs/toolkit';
import interfaceSlice from './store/interfaceSlice.js';

const store = configureStore({
  reducer: {
    interfaceSlice:interfaceSlice,
  },
});
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    </Provider>
  </StrictMode>
);
