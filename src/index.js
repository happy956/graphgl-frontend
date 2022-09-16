import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import client from './component/client';
import { ApolloProvider } from "@apollo/client";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ApolloProvider client={client}>
    <App />
    </ApolloProvider>
);
// serviceWorkerRegistration.register();
// reportWebVitals();