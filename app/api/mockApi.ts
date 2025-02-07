// Simulating API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export type Message = {
  role: "user" | "assistant"
  content: string
}

export type Chat = {
  id: number
  title: string
}

// Mock chat history
let chatHistory: Chat[] = [
  { id: 1, title: "Chat about React hooks" },
  { id: 2, title: "Discussing AI ethics" },
  { id: 3, title: "Learning about Next.js" },
]

// Mock messages
let messages: Message[] = []

export const mockApi = {
  // Fetch chat history
  getChatHistory: async (): Promise<Chat[]> => {
    await delay(500) // Simulate network delay
    return [...chatHistory]
  },

  // Create a new chat
  createNewChat: async (title: string): Promise<Chat> => {
    await delay(500)
    const newChat = { id: chatHistory.length + 1, title }
    chatHistory = [...chatHistory, newChat]
    return newChat
  },

  // Fetch messages for a chat
  getMessages: async (): Promise<Message[]> => {
    await delay(500)
    return [...messages]
  },

  // Send a message and get a response
  sendMessage: async (content: string): Promise<Message> => {
    await delay(1000) // Simulate AI processing time
    const userMessage: Message = { role: "user", content }
    const assistantMessage: Message = { role: "assistant", content: `Echo: ${content}` }
    messages = [...messages, userMessage, assistantMessage]
    return assistantMessage
  },
}

