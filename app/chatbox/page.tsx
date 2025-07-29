'use client'

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Moon, Sun, Send } from "lucide-react"

interface Message {
    role: "user" | "assistant"
    content: string
}

export default function ChatBox(onSubmitFirstMessage: any) {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [loading, setLoading] = useState(false)
    const [theme, setTheme] = useState<"light" | "dark">("dark")
    const [submitted, setSubmitted] = useState(false)

    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        document.body.className = theme
    }, [theme])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const toggleTheme = () => {
        setTheme(prev => (prev === "light" ? "dark" : "light"))
    }

    const sendMessage = async () => {
        if (!input.trim()) return

        if (!submitted) {
            setSubmitted(true)
            onSubmitFirstMessage()
        }

        const userMsg: Message = { role: "user", content: input }
        const updated = [...messages, userMsg]
        setMessages(updated)
        setInput("")
        setLoading(true)

        try {
            const res = await fetch("/api/gpt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: updated }),
            })
            const data = await res.json()
            const assistantMsg: Message = { role: "assistant", content: data.reply }
            setMessages(prev => [...prev, assistantMsg])
        } catch (err) {
            console.error("Error:", err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className={`w-full sm:max-w-3xl mx-auto relative py-0 flex flex-col transition-all duration-300 ${submitted ? "h-[100dvh]" : "h-auto"
            }`}>
            <CardHeader className="p-2 bg-muted">
                <div className="flex justify-between items-center">
                    <h1 className="text-lg font-semibold">AIVA (AI Virtual Assistant)</h1>
                    <Button variant="ghost" size="icon" onClick={toggleTheme}>
                        {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </Button>
                    </div>
                </CardHeader>

            {submitted && (
                <ScrollArea className={`px-4  flex-1 overflow-y-auto transition-all duration-300 mb-[80px]`}>
                    <div className="flex flex-col gap-3">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`rounded-xl px-4 py-2 text-sm max-w-[75%] whitespace-pre-line ${msg.role === "user"
                                        ? "ml-auto bg-blue-500 text-white"
                                        : "mr-auto bg-muted text-black dark:text-white"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {loading && (
                            <div className="text-sm italic text-muted-foreground">Assistant is typing...</div>
                            )}
                            <div ref={bottomRef} />
                        </div>
                </ScrollArea>
            )}

            <CardFooter
                className={`w-full px-4 py-4 ${submitted ? "absolute bottom-0 left-0 bg-background border-t" : "flex justify-center items-center"
                    }`}
            >
                <div className="w-full max-w-3xl">
                    <div className="relative">
                        <Textarea
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    sendMessage()
                                }
                            }}
                            className="flex-1 resize-none min-h-[10px] max-h-20 pr-16" 
                        />
                        <div
                            className={`absolute flex align-items-end bottom-0 right-2 h-8 px-3 text-sm ${input.trim() ? `block` : `hidden`}`}
                        >
                            <Send
                                onClick={sendMessage} />

                        </div>
                    </div>
                </div>

                </CardFooter>
        </Card>
    )
}
