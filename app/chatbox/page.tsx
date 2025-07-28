'use client'
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Moon, Sun } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
    role: "user" | "assistant";
    content: string;
}

export const ChatBox = () => {
    const [question, setQuestion] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('dark'); // Initial theme set to 'light'

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        document.body.className = theme; // Apply the theme to the body element
    }, [theme]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMessage: Message = { role: "user", content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/gpt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });
            const data = await res.json();
            const assistantMessage: Message = { role: "assistant", content: data.reply };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error("GPT fetch error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Card className="w-xl sm-[w-full] p-0 pb-6">
                <CardHeader className="text-center p-2 bg-muted">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="m-0">AIVA (AI Virtual Assitant)</h1>
                        <div>
                            <button onClick={toggleTheme} className="ml-4 p-2 rounded">
                                {theme === 'light' ? <Moon className="h-[1.2rem] w-[1.2rem] rotate-90 transition-all dark:scale-100 dark:rotate-0" /> : <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all light:scale-0 light:-rotate-90" />
                                }
                            </button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="overflow-hidden flex-1">
                    <ScrollArea className="h-[60vh] pr-4 space-y-2">
                        <div className="flex flex-col gap-2 justify-end h-full">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`rounded-xl mb-2 px-4 py-2 text-sm whitespace-pre-line max-w-[75%] ${msg.role === "user"
                                        ? "ml-auto bg-blue-500 text-white"
                                        : "mr-auto bg-muted text-white"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {loading && (
                                <div className="italic text-sm text-muted-foreground">Assistant is typing...</div>
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter>
                    <div className="flex w-full gap-3">
                        <Input onChange={(e) => setInput(e.target.value)}
                            value={input}
                            placeholder="Type your message..."
                            className="flex-1"
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()} />
                        <Button onClick={sendMessage} disabled={loading}>Send</Button>
                    </div>

                </CardFooter>
            </Card>
        </>
    )
}