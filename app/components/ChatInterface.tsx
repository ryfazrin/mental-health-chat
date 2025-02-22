"use client"

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { API_BASE_URL, ENDPOINTS } from "@/constants/endpoints";
import Typewriter from "typewriter-effect";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatInterface({ className }: any) {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialMessage: Message = {
      role: "assistant",
      content:
        "Hai! Saya di sini untuk membantu Anda. Sebelum kita mulai, boleh kenalan dulu? 😊\n📝 Ketik nama, usia, dan gender Anda dalam format berikut:*\n📌 Nama - Usia - Gender (L/P)",
    };
    setMessages([initialMessage]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatMessageContent = (content: string) => {
    return content.replace(/\*(.*?)\*/g, "<b>$1</b>");
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      let response;
      if (!userId) {
        response = await axios.post(`${API_BASE_URL}${ENDPOINTS.START}`, { message: input });
        if (response.data.success) {
          setUserId(response.data.chat.userId);
        }
      } else {
        response = await axios.post(`${API_BASE_URL}/proses/${userId}`, { message: input });
      }

      if (response.data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: response.data.chat.response,
        };

        setTimeout(() => {
          setMessages((prevMessages) => [...prevMessages, assistantMessage]);
        }, 1500);
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "Error sending message",
          action: <ToastAction altText="Close">Close</ToastAction>,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Error sending message",
        action: <ToastAction altText="Close">Close</ToastAction>,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}
          >
            <div
              className={`inline-block p-2 rounded-lg ${
                message.role === "user"
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.role === "assistant" ? (
                <Typewriter
                  onInit={(typewriter) => {
                    typewriter
                      .typeString(formatMessageContent(message.content).replace(/\n/g, "<br/>"))
                      .pauseFor(500)
                      .callFunction(() => {
                        document.querySelector(".Typewriter__cursor")?.remove();
                      })
                      .start();
                  }}
                  options={{ delay: 10 }}
                />
              ) : (
                <span
                  dangerouslySetInnerHTML={{
                    __html: formatMessageContent(message.content),
                  }}
                />
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="mb-4 text-left">
            <div className="inline-block p-2 rounded-lg bg-gray-200 text-gray-800">
              <span className="dot">...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
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
          <Button onClick={handleSend} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
