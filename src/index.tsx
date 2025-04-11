import * as Sentry from '@sentry/react'
import ReactDOM from 'react-dom/client'

import App from './App'

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_URL,
})

const rootElement = document.getElementById('root')!
const root = ReactDOM.createRoot(rootElement)

root.render(<App />)
