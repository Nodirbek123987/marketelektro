import { MessageCircle } from "lucide-react";

const FloatingTelegram = () => (
  <a
    href="https://t.me/Azim667"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#0088cc] text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl active:scale-95"
    title="Написать в Telegram"
  >
    <MessageCircle className="h-6 w-6" />
  </a>
);

export default FloatingTelegram;
