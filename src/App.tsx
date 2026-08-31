import { LayoutProvider } from '@/contexts/LayoutContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { Router } from '@/router'

const App = () => {
  return (
    <div data-testid="app-container">
      <AuthProvider>
        <LayoutProvider>
          <Router />
        </LayoutProvider>
      </AuthProvider>
    </div>
  )
}

export default App
