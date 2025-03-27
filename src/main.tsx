import { PrivyProvider } from '@privy-io/react-auth';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import { StateContextProvider } from './context/index.tsx';
import './index.css';

console.log(
  import.meta.env.VITE_PRIVY_APP_ID,
  import.meta.env.VITE_PRIVY_CLIENT_ID
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrivyProvider
      appId={`${import.meta.env.VITE_PRIVY_APP_ID}`}
      clientId={`${import.meta.env.VITE_PRIVY_CLIENT_ID}`}
      config={{
        // // Display email and wallet as login methods
        // loginMethods: ['email', 'wallet'],
        appearance: {
          theme: 'dark',
          // accentColor: '#676FFF',
          // logo: 'https://your-logo-url',
        },
        // Create embedded wallets for users who don't have a wallet
        // embeddedWallets: {
        //   createOnLogin: 'users-without-wallets',
        // },
      }}
    >
      <BrowserRouter>
        <StateContextProvider>
          <App />
        </StateContextProvider>
      </BrowserRouter>
    </PrivyProvider>
    ,
  </StrictMode>
);
