'use client'

import { useState } from "react"
import { ChatBox } from "./chatbox/page"

export default function Home() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div
      className={`w-full min-h-screen font-sans ${submitted ? "flex flex-col justify-end" : "flex items-center justify-center"
        }`}
    >
      <ChatBox onSubmitFirstMessage={() => setSubmitted(true)} />
    </div>
  )
}
