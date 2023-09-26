import {useState} from "react";
import {MessageList, MessageListItem} from "@hilla/react-components/MessageList";
import {ChatService} from "Frontend/generated/endpoints";
import {MessageInput} from "@hilla/react-components/MessageInput";

export default function StreamingChatView() {
    const [messages, setMessages] = useState<MessageListItem[]>([]);

    function addMessage(message: MessageListItem) {
        setMessages(messages => [...messages, message]);
    }
    function appendToLastMessage(chunk: string) {
        setMessages(messages => {
            const lastMessage = messages[messages.length - 1];
            return [...messages.slice(0, -1), {
                text: lastMessage.text + chunk,
                userName: lastMessage.userName
            }];
        });
    }

    async function sendMessage(message: string) {
        addMessage({
            text: message,
            userName: 'You'
        });

        let first = true;
        ChatService.chatStream(message).onNext(chunk => {
            if (first) {
                addMessage({
                    text: chunk,
                    userName: 'Assistant'
                });

                first = false;
            } else {
                appendToLastMessage(chunk);
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
