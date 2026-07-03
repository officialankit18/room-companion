import { Send, Wifi, WifiOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import { conversationApi } from "../../api/conversationApi";
import { Button, Card, EmptyState, Input, PageHeader, Spinner } from "../../components/ui";
import { USER_ROLES } from "../../constants/roles";
import { useAuth } from "../../hooks/useAuth";
import { createSocketClient } from "../../socket/socketClient";

const getOtherParticipant = (conversation, currentUser) => {
  if (!conversation || !currentUser) return null;
  return currentUser.role === USER_ROLES.TENANT ? conversation.ownerId : conversation.tenantId;
};

export function ChatPage() {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const bottomRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUser, setTypingUser] = useState(null);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedConversationId),
    [conversations, selectedConversationId]
  );
  const otherParticipant = getOtherParticipant(selectedConversation, user);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await conversationApi.getConversations();
        const conversationList = response.data.conversations;
        setConversations(conversationList);
        if (conversationList.length) {
          setSelectedConversationId(conversationList[0]._id);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  useEffect(() => {
    const socket = createSocketClient();
    socketRef.current = socket;

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("socketError", (payload) => toast.error(payload.message));
    socket.on("newMessage", (message) => {
      if (message.conversationId === selectedConversationId) {
        setMessages((currentMessages) => {
          if (currentMessages.some((item) => item._id === message._id)) {
            return currentMessages;
          }
          return [...currentMessages, message];
        });
      }
    });
    socket.on("typing", ({ userId }) => {
      if (userId !== user.id) {
        setTypingUser(userId);
      }
    });
    socket.on("stopTyping", () => setTypingUser(null));
    socket.on("messageRead", ({ conversationId }) => {
      if (conversationId === selectedConversationId) {
        setMessages((currentMessages) =>
          currentMessages.map((message) =>
            message.senderId?._id === user.id || message.senderId === user.id
              ? { ...message, isRead: true, status: "READ" }
              : message
          )
        );
      }
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [selectedConversationId, user.id]);

  useEffect(() => {
    if (!selectedConversationId || !socketRef.current) return;

    const loadMessages = async () => {
      setIsMessagesLoading(true);
      try {
        socketRef.current.emit("joinConversation", { conversationId: selectedConversationId });
        const response = await conversationApi.getMessages(selectedConversationId, { limit: 30 });
        setMessages(response.data.messages);
        await conversationApi.markRead(selectedConversationId);
        socketRef.current.emit("messageRead", { conversationId: selectedConversationId });
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsMessagesLoading(false);
      }
    };

    loadMessages();

    return () => {
      socketRef.current?.emit("leaveConversation", { conversationId: selectedConversationId });
    };
  }, [selectedConversationId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (event) => {
    event.preventDefault();
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || !selectedConversationId) return;

    socketRef.current?.emit("sendMessage", {
      conversationId: selectedConversationId,
      message: trimmedMessage,
    });
    socketRef.current?.emit("stopTyping", { conversationId: selectedConversationId });
    setMessageText("");
  };

  const handleTyping = (value) => {
    setMessageText(value);
    if (!selectedConversationId) return;

    socketRef.current?.emit(value ? "typing" : "stopTyping", {
      conversationId: selectedConversationId,
    });
  };

  return (
    <>
      <PageHeader
        eyebrow="Chat"
        title="Accepted conversations"
        description="Chat is available only after an owner accepts a tenant interest request."
        action={
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-[var(--color-body)]">
            {isConnected ? <Wifi size={16} className="text-[var(--color-success)]" /> : <WifiOff size={16} />}
            {isConnected ? "Connected" : "Offline"}
          </span>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner label="Loading conversations" />
        </div>
      ) : conversations.length ? (
        <div className="grid min-h-[620px] gap-5 lg:grid-cols-[320px_1fr]">
          <Card className="p-3">
            <div className="max-h-72 space-y-2 overflow-y-auto lg:max-h-none">
              {conversations.map((conversation) => {
                const participant = getOtherParticipant(conversation, user);
                const unread =
                  user.role === USER_ROLES.TENANT
                    ? conversation.tenantUnread
                    : conversation.ownerUnread;

                return (
                  <button
                    key={conversation._id}
                    className={[
                      "focus-ring w-full rounded-xl p-3 text-left transition",
                      selectedConversationId === conversation._id
                        ? "bg-indigo-50"
                        : "hover:bg-slate-50",
                    ].join(" ")}
                    type="button"
                    onClick={() => setSelectedConversationId(conversation._id)}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate font-semibold text-[var(--color-heading)]">{participant?.name}</p>
                      {unread ? (
                        <span className="rounded-full bg-[var(--color-primary)] px-2 py-0.5 text-xs font-bold text-white">
                          {unread}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1 truncate text-sm text-[var(--color-body)]">
                      {conversation.listingId?.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="flex min-h-[520px] flex-col p-0 lg:min-h-[620px]">
            <div className="border-b border-[var(--color-border)] p-5">
              <h2 className="font-semibold text-[var(--color-heading)]">
                {otherParticipant?.name || "Conversation"}
              </h2>
              <p className="mt-1 line-clamp-2 text-sm text-[var(--color-body)]">
                {selectedConversation?.listingId?.title}
              </p>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-5">
              {isMessagesLoading ? (
                <Spinner label="Loading messages" />
              ) : messages.length ? (
                messages.map((message) => {
                  const senderId = message.senderId?._id || message.senderId;
                  const isOwn = senderId === user.id;
                  return (
                    <div key={message._id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={[
                          "max-w-[78%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                          isOwn
                            ? "bg-[var(--color-primary)] text-white"
                            : "border border-[var(--color-border)] bg-white text-[var(--color-heading)]",
                        ].join(" ")}
                      >
                        <p>{message.message}</p>
                        <p className={`mt-1 text-[11px] ${isOwn ? "text-indigo-100" : "text-[var(--color-muted)]"}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {isOwn ? ` / ${message.isRead ? "Read" : message.status}` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-sm text-[var(--color-body)]">No messages yet.</p>
              )}
              {typingUser ? <p className="text-sm text-[var(--color-muted)]">Typing...</p> : null}
              <div ref={bottomRef} />
            </div>

            <form className="border-t border-[var(--color-border)] p-4" onSubmit={sendMessage}>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  aria-label="Message"
                  placeholder="Type your message"
                  value={messageText}
                  onChange={(event) => handleTyping(event.target.value)}
                />
                <Button type="submit" disabled={!messageText.trim()} className="sm:w-auto">
                  <Send size={18} />
                  Send
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : (
        <EmptyState
          title="No conversations yet"
          description="Conversations appear here after an owner accepts an interest request."
        />
      )}
    </>
  );
}
