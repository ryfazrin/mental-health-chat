"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageCircle } from "lucide-react"
import { mockApi, type Chat } from "../api/mockApi"

export default function Sidebar() {
  const [chatHistory, setChatHistory] = useState<Chat[]>([])

  useEffect(() => {
    const fetchChatHistory = async () => {
      const history = await mockApi.getChatHistory()
      setChatHistory(history)
    }
    fetchChatHistory()
  }, [])

  const handleNewChat = async () => {
    const newChat = await mockApi.createNewChat("New Chat")
    setChatHistory([...chatHistory, newChat])
  }

  return (
    <div className="w-64 bg-gray-900 text-white p-4 flex flex-col">
      <Button className="mb-4 w-full" variant="outline" onClick={handleNewChat}>
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

