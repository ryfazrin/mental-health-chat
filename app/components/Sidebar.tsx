import { Button } from "@/components/ui/button"
import { PlusCircle, MessageCircle } from "lucide-react"

const chatHistory = [
  { id: 1, title: "Chat about React hooks" },
  { id: 2, title: "Discussing AI ethics" },
  { id: 3, title: "Learning about Next.js" },
]

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      <Button className="mb-4 w-full" variant="secondary">
        <PlusCircle className="mr-2 h-4 w-4" /> New Chat
      </Button>
      <div className="flex-grow overflow-y-auto">
        {chatHistory.map((chat) => (
          <div key={chat.id} className="flex items-center mb-2 p-2 hover:bg-gray-800 rounded cursor-pointer">
            <MessageCircle className="mr-2 h-4 w-4" />
            <span className="text-sm truncate">{chat.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

