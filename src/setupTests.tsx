import '@testing-library/jest-dom'

jest.setTimeout(5000) // in milliseconds

// global modules mock
jest.mock('@chakra-ui/react', () => ({
  Tooltip: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))
