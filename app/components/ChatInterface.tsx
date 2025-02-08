"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { API_BASE_URL, ENDPOINTS } from "@/constants/endpoints"
import Typewriter from 'typewriter-effect';

interface Message {
  role: "user" | "assistant";  // Role bisa berupa 'user' atau 'assistant'
  content: string;            // Isi pesan
}

export default function ChatInterface() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false) // Menambahkan state loading

  useEffect(() => {
    const initialMessage: Message = {
      role: "assistant",
      content: "Hai! Saya di sini untuk membantu Anda. Sebelum kita mulai, boleh kenalan dulu? 😊\n📝 Ketik nama, usia, dan gender Anda dalam format berikut:*\n📌 Nama - Usia - Gender (L/P)"
    }
    setMessages([initialMessage])
  }, [])

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { role: "user", content: input }
      setMessages([...messages, userMessage])
      setInput("")
      setLoading(true) // Set loading menjadi true ketika menunggu balasan

      try {
        // Mengirim request ke API dengan payload
        const response = await axios.post(`${API_BASE_URL}${ENDPOINTS.START}`, {
          message: input
        })

        if (response.data.success) {
          const assistantMessage: Message = {
            role: "assistant",
            content: response.data.chat.response
          }

          // Adding the typing effect for the assistant's message
          const newMessages = [...messages, userMessage]

          setMessages(newMessages);
          setTimeout(() => {
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                role: "assistant",
                content: response.data.chat.response,
              },
            ]);
          }, 1500); // Adjust the typing speed
        } else {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "Error sending message",
            action: (
              <ToastAction altText="Close">Close</ToastAction>
            ),
          });
        }
      } catch (error) {
        console.error("Error sending message:", error)
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Error sending message",
          action: (
            <ToastAction altText="Close">Close</ToastAction>
          ),
        });
      } finally {
        setLoading(false) // Set loading menjadi false setelah mendapatkan balasan
      }
    }
  }

  const typeMessageWithNewlines = (messageContent: string) => {
    // Split the message by newline character
    const lines = messageContent.split("\n");

    return lines.map((line, index) => (
      <Typewriter
        key={index}
        onInit={(typewriter) => {
          typewriter
            .typeString(line)
            .pauseFor(500) // Pause after each line
            .start();
        }}
        options={{
          delay: 50, // Adjust the typing speed for each line
        }}
      />
    ));
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
              {message.role === "assistant" ? (
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(message.content.replace(/\n/g, '<br/>'))
                      .pauseFor(500)
                      .start();
                  }}
                  options={{
                    delay: 10,  // Adjust this number to control speed (smaller is faster)
                  }}
                />
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-4 text-left">
            <div className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800">
              <span className="dot">...</span> {/* Tampilkan animasi titik */}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow mr-2"
            onKeyUp={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
