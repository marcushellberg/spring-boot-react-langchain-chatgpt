import {useState} from "react";
import {MessageList, MessageListItem} from "@hilla/react-components/MessageList";
import {MessageInput} from "@hilla/react-components/MessageInput";
import {ChatService} from "Frontend/generated/endpoints";

export default function ChatView() {
    const [messages, setMessages] = useState<MessageListItem[]>([]);

    async function sendMessage(message: string) {
        setMessages(messages => [...messages, {
            text: message,
            userName: 'You'
        }]);

        const response = await ChatService.chat(message);
        setMessages(messages => [...messages, {
            text: response,
            userName: 'Assistant'
        }]);
    }

    return (
      <div className="p-m flex flex-col h-full box-border">
          <MessageList items={messages} className="flex-grow"/>
          <MessageInput onSubmit={e => sendMessage(e.detail.value)}/>
      </div>
    );
}
