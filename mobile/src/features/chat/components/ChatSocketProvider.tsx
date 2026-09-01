import { useChatSocket } from "@/hooks/chat/useChatSocket";

type ChatSocketProviderProps = {
  children: React.ReactNode;
};

export default function ChatSocketProvider({
  children,
}: ChatSocketProviderProps) {
  useChatSocket();
  return children;
}
