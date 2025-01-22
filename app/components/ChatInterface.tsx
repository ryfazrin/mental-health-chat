"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { mockApi, Message } from "../api/mockApi"

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  useEffect(() => {
    const fetchMessages = async () => {
      const fetchedMessages = await mockApi.getMessages()
      setMessages(fetchedMessages)
    }
    fetchMessages()
  }, [])

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: "user", content: input }
      setMessages([...messages, userMessage])
      setInput("")

      const assistantMessage = await mockApi.sendMessage(input)
      setMessages((prevMessages) => [...prevMessages, assistantMessage])
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow mr-2"
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

