import { LayoutProvider } from '@/contexts/LayoutContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { TooltipProvider } from '@/components/Tooltip/Tooltip'
import { Toaster } from '@/components/ui/sonner'
import { Router } from '@/router'

const App = () => {
  return (
    <div data-testid="app-container">
      <TooltipProvider>
        <AuthProvider>
          <LayoutProvider>
            <Router />
          </LayoutProvider>
        </AuthProvider>
      </TooltipProvider>
      <Toaster />
    </div>
  )
}

export default App
