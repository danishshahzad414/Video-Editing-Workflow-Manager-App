import { type ReactNode } from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface Props {
  children: ReactNode
  title?: string
}

export default function Layout({ children, title }: Props) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#00293A' }}>
      {/* 3px accent stripe */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#00A2CF] z-[9999]" />

      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden pt-[3px]">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
