"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { Message } from "db";
import { useAtom } from "jotai";
import { messagesAtoms } from "../atoms/messages";
import { getConversations } from "../actions/conversation";

export default function Socketio({
  host,
  token,
}: {
  host: string;
  token: string;
}) {
  const [messages, setMessages] = useAtom(messagesAtoms);

  useEffect(() => {
    getConversations().then((res) => {
      if (res.success) {
        let messages: Message[] = [];
        res.data?.forEach((conversation) => {
          messages = [...messages, ...conversation.messages];
        });
        setMessages(messages);
      }
    });
  }, [setMessages]);

  useEffect(() => {
    const socket = io(host, {
      auth: {
        token,
      },
    });
    socket.on("connect", () => {
      console.log("connected");
    });
    socket.on("message", (data: Message) => {
      // if received message exists in store don't add it just update
      const index = messages.findIndex((message) => message.id === data.id);
      if (index !== -1) {
        const newMessages = [...messages];
        newMessages[index] = data;
        setMessages(newMessages);
      } else {
        setMessages([...messages, data]);
      }
    });
    socket.on("disconnect", () => {
      console.log("disconnected");
      //
    });

    return () => {
      socket?.disconnect();
    };
  }, [host, token, messages, setMessages]);

  return null;
}
