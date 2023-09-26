import {useState} from "react";
import {MessageList, MessageListItem} from "@hilla/react-components/MessageList";
import {ChatService} from "Frontend/generated/endpoints";
import {MessageInput} from "@hilla/react-components/MessageInput";

export default function StreamingChatView() {
    const [messages, setMessages] = useState<MessageListItem[]>([]);

    async function sendMessage(message: string) {
        setMessages(messages => [...messages, {
            text: message,
            userName: 'You'
        }]);

        let first = true;
        ChatService.chatStream(message).onNext(chunk => {
            if (first) {
                setMessages(messages => [...messages, {
                    text: chunk,
                    userName: 'Assistant'
                }]);
                first = false;
            } else {
                setMessages(messages => [...messages.slice(0, -1), {
                    text: messages[messages.length - 1].text + chunk,
                    userName: 'Assistant'
                }]);
            }
        });
    }

    return (
        <div className="p-m flex flex-col h-full box-border">
            <MessageList items={messages} className="flex-grow"/>
            <MessageInput onSubmit={e => sendMessage(e.detail.value)}/>
        </div>
    );
}
