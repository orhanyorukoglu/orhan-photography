import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

// No <StrictMode>: its double-mount in dev makes the React Bits WebGL components
// (Aurora, CircularGallery) lose their GL context on the throwaway first mount.
createRoot(document.getElementById('root')).render(<App />);
