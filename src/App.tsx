import { useEffect, useState } from 'react'
import Chat from './Chat.tsx'
import { AppSidebar } from './components/app-sidebar.tsx'
import { ThemeProvider } from './components/theme-provider.tsx'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import { cn } from './lib/utils.ts'
import { migrateFromLocalStorage } from './lib/chat-db.ts'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    migrateFromLocalStorage()
      .then((migrated) => {
        if (migrated) {
          window.dispatchEvent(new Event('conversations-changed'))
        }
      })
      .catch((err: unknown) => {
        console.error('Migration failed:', err)
      })
      .finally(() => {
        setReady(true)
      })
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="pydantic-chat-ui-theme">
        <SidebarProvider defaultOpen>
          <AppSidebar />

          <div className="relative flex h-dvh min-h-0 flex-1 flex-col justify-center overflow-hidden">
            <div className="absolute top-3 left-3 z-20 md:hidden">
              <SidebarTrigger />
            </div>
            <div
              className={cn(
                'relative mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col overflow-hidden',
                'has-[.stick-to-bottom:empty]:overflow-visible transition-[flex-basis] duration-200',
              )}
            >
              {ready && <Chat />}
            </div>
          </div>
        </SidebarProvider>
      </ThemeProvider>
      <Toaster richColors />
    </QueryClientProvider>
  )
}
