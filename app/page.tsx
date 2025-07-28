import Image from "next/image";
import { ChatBox } from "./chatbox/page";

export default function Home() {
  return (
    <div className="font-sans flex items-center justify-center min-h-screen w-full">
      <ChatBox />
    </div>
  );
}
