import Sidebar from "./components/Sidebar"
import ChatInterface from "./components/ChatInterface"

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100 flex-col sm:flex-row">
      <Sidebar className="w-full sm:w-1/4" />
      <ChatInterface className="flex-1" />
    </div>
  )
}

