import Sidebar from "./components/Sidebar"
import ChatInterface from "./components/ChatInterface"

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <ChatInterface />
    </div>
  )
}

