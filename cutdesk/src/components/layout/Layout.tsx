import { type ReactNode, useState } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface Props {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title }: Props) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F1F5F9' }}>
      {/* 3px gradient accent stripe */}
      <div className="fixed top-0 left-0 right-0 h-[3px] z-[9999]" style={{ background: 'linear-gradient(90deg, #0284C7, #06B6D4, #0EA5E9)' }} />

      {/* Mobile overlay backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(15,23,42,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto transition-transform duration-300 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ height: '100%' }}
      >
        <Sidebar onClose={() => setMobileSidebarOpen(false)} />
      </div>

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden pt-[3px] lg:ml-0">
        <TopBar title={title} onMenuClick={() => setMobileSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
