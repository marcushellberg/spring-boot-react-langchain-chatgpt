import {useState} from "react";
import {MessageList, MessageListItem} from "@hilla/react-components/MessageList";
import {MessageInput} from "@hilla/react-components/MessageInput";
import {ChatService} from "Frontend/generated/endpoints";
import {Button} from "@hilla/react-components/Button";


export default function ChatView() {
    const [messages, setMessages] = useState<MessageListItem[]>([]);

    function appendToLastMessage(chunk: string) {
        setMessages(messages => {
            const lastMessage = messages[messages.length - 1];
            const rest = messages.slice(0, messages.length - 1);
            lastMessage.text += chunk;
            return [...rest, lastMessage];
        });
    }

    function send(message: string) {
        setMessages(messages => [...messages, {
            userName: 'You',
            text: message,
        }]);

        let first = true;

        ChatService.chat(message).onNext(chunk => {
            if (first) {
                setMessages(messages => [...messages, {
                    userName: 'Assistant',
                    text: chunk,
                }]);
                first = false;
            } else {
                appendToLastMessage(chunk);
            }
        });
    }

    return (
        <div className="p-m flex flex-col h-full box-border">
            <MessageList items={messages} className="flex-grow"/>
            <MessageInput onSubmit={e => send(e.detail.value)}/>
        </div>
    );
}
