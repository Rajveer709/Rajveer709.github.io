
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    if (registrations.length > 0) {
      console.log('Unregistering existing service workers...');
      const unregisterPromises = registrations.map(registration => registration.unregister());
      Promise.all(unregisterPromises).then(() => {
        console.log('Service workers unregistered. Reloading page.');
        window.location.reload();
      });
    }
  });
}

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
