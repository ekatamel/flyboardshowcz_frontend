import ReactGA from 'react-ga4'

// Initialize Google Analytics
export const initGA = () => {
  // TODO set in env variables
  ReactGA.initialize('G-1PYFQB299S')
}

// Track Page View
export const trackPageView = path => {
  ReactGA.send({ hitType: 'pageview', page: path })
}
