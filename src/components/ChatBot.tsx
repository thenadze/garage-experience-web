
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare } from "lucide-react";

interface Message {
  type: "user" | "bot";
  content: string;
}

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      type: "user",
      content: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    processUserMessage(inputValue);
    setInputValue("");
  };

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    let response: Message = {
      type: "bot",
      content: "Désolé, je ne comprends pas. Essayez de me demander de l'aide pour la navigation ou des informations sur nos services.",
    };

    if (lowerMessage.includes("devis") || lowerMessage.includes("estimation")) {
      response.content = "Je peux vous rediriger vers notre page de devis. Cliquez ici pour y accéder.";
      setTimeout(() => navigate("/devis"), 1500);
    } else if (lowerMessage.includes("contact") || lowerMessage.includes("joindre")) {
      response.content = "Je vous redirige vers la section contact.";
      setTimeout(() => {
        setIsOpen(false);
        const element = document.getElementById("contact");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 1500);
    } else if (lowerMessage.includes("service")) {
      response.content = "Je vous redirige vers la section services.";
      setTimeout(() => {
        setIsOpen(false);
        const element = document.getElementById("services");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 1500);
    } else if (lowerMessage.includes("voiture") || lowerMessage.includes("vehicule") || lowerMessage.includes("véhicule")) {
      response.content = "Je vous redirige vers notre section véhicules.";
      setTimeout(() => {
        setIsOpen(false);
        const element = document.getElementById("vehicules");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 1500);
    }

    setMessages((prev) => [...prev, response]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="icon"
          className="fixed bottom-4 right-4 rounded-full h-12 w-12 bg-garage-red hover:bg-garage-red/90"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assistant Garage Auto</DialogTitle>
          <DialogDescription>
            Comment puis-je vous aider aujourd'hui ?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            <div className="flex flex-col space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.type === "user"
                        ? "bg-garage-red text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre message ici..."
              className="flex-1"
            />
            <Button type="submit">Envoyer</Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatBot;
