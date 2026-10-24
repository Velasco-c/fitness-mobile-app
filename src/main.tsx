import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/tokens/palette.css';
import './styles/tokens/theme.css';
import './styles/tokens/layout.css';
import './styles/base.css';
import './styles/components.css';
import './styles/screens.css';
import './styles/levels.css';
import './styles/login.css';
import './styles/intro.css';
import './styles/summary.css';
import './styles/panels.css';
import './styles/profile.css';
import './styles/welcome.css';
import './styles/water.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
