"use client";

import { useMemo, useState, useEffect, useRef, FormEvent } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  useFarmerChatStore,
  type ChatRoom,
  type ChatMessage,
  type ChatMessageDraft,
} from "@/store/farmer-chat";
import { useAccount } from "wagmi";
import { usePlantationsStore } from "@/store/plantations";

type FarmerChatPanelProps = {
  onSelectWallet?: (walletAddress: string) => void;
};

type ChatView = "rooms" | "direct";

export default function FarmerChatPanel({
  onSelectWallet,
}: FarmerChatPanelProps) {
  const { address } = useAccount();
  const rooms = useFarmerChatStore((state) => state.rooms);
  const messages = useFarmerChatStore((state) => state.messages);
  const addMessage = useFarmerChatStore((state) => state.addMessage);
  const markMessagesRead = useFarmerChatStore(
    (state) => state.markMessagesRead
  );
  const getRoomMessages = useFarmerChatStore(
    (state) => state.getRoomMessages
  );
  const getDirectMessages = useFarmerChatStore(
    (state) => state.getDirectMessages
  );
  const getUnreadCount = useFarmerChatStore((state) => state.getUnreadCount);

  const plantations = usePlantationsStore((state) => state.plantations);

  const [view, setView] = useState<ChatView>("rooms");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(
    rooms[0]?.id ?? null
  );
  const [selectedDirectWallet, setSelectedDirectWallet] = useState<
    string | null
  >(null);
  const [messageText, setMessageText] = useState("");
  const [attachmentUrl, setAttachmentUrl] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === selectedRoomId),
    [rooms, selectedRoomId]
  );

  const roomMessages = useMemo(() => {
    if (!selectedRoomId) {
      return [];
    }
    return getRoomMessages(selectedRoomId);
  }, [selectedRoomId, messages, getRoomMessages]);

  const directMessages = useMemo(() => {
    if (!selectedDirectWallet || !address) {
      return [];
    }
    return getDirectMessages(selectedDirectWallet, address);
  }, [selectedDirectWallet, address, messages, getDirectMessages]);

  const uniqueWallets = useMemo(() => {
    const walletSet = new Set<string>();
    messages.forEach((msg) => {
      if (msg.senderWalletAddress && msg.senderWalletAddress !== address) {
        walletSet.add(msg.senderWalletAddress);
      }
      if (
        msg.recipientWalletAddress &&
        msg.recipientWalletAddress !== address
      ) {
        walletSet.add(msg.recipientWalletAddress);
      }
    });
    return Array.from(walletSet);
  }, [messages, address]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages, directMessages]);

  useEffect(() => {
    if (selectedRoomId) {
      markMessagesRead(selectedRoomId);
    }
    if (selectedDirectWallet) {
      markMessagesRead(undefined, selectedDirectWallet);
    }
  }, [selectedRoomId, selectedDirectWallet, markMessagesRead]);

  const handleAddAttachment = () => {
    const trimmed = attachmentUrl.trim();
    if (!trimmed) {
      return;
    }
    setAttachments((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed]
    );
    setAttachmentUrl("");
  };

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = messageText.trim();
    if (!text || !address) {
      return;
    }

    const draft: ChatMessageDraft = {
      roomId: view === "rooms" ? selectedRoomId ?? undefined : undefined,
      recipientWalletAddress:
        view === "direct" ? selectedDirectWallet ?? undefined : undefined,
      senderWalletAddress: address,
      content: text,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    addMessage(draft);
    setMessageText("");
    setAttachments([]);
  };

  const currentMessages =
    view === "rooms" ? roomMessages : directMessages;

  const formatWalletAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const getSenderName = (msg: ChatMessage) => {
    if (msg.senderName) {
      return msg.senderName;
    }
    const plantation = plantations.find(
      (p) => p.walletAddress === msg.senderWalletAddress
    );
    if (plantation) {
      return plantation.seedName;
    }
    return formatWalletAddress(msg.senderWalletAddress);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      className="rounded-3xl border border-cocoa-800/60 bg-[#101f3c]/80 p-6 text-slate-100 shadow-xl shadow-black/20 backdrop-blur"
    >
      <header className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Farmer chat</h2>
          <p className="text-sm text-slate-300/80">
            Connect with fellow farmers through topic rooms and direct messages.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setView("rooms")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition",
              view === "rooms"
                ? "border-leaf-400/60 bg-leaf-500/20 text-leaf-300"
                : "border-slate-600/40 bg-slate-900/60 text-slate-200 hover:border-slate-400/60"
            )}
          >
            Rooms
          </button>
          <button
            type="button"
            onClick={() => setView("direct")}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] transition",
              view === "direct"
                ? "border-leaf-400/60 bg-leaf-500/20 text-leaf-300"
                : "border-slate-600/40 bg-slate-900/60 text-slate-200 hover:border-slate-400/60"
            )}
          >
            Direct
            {uniqueWallets.length > 0 && (
              <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-300">
                {uniqueWallets.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[250px,1fr]">
        <aside className="space-y-2">
          {view === "rooms" ? (
            <>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300/70">
                Topic rooms
              </h3>
              <ul className="space-y-1">
                {rooms.map((room) => {
                  const unread = getUnreadCount(room.id);
                  return (
                    <li key={room.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedRoomId(room.id)}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left transition",
                          selectedRoomId === room.id
                            ? "border-leaf-400/60 bg-leaf-500/10"
                            : "border-slate-700/40 bg-slate-900/50 hover:border-slate-500/60"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-semibold text-white">
                            {room.name}
                          </p>
                          {unread > 0 && (
                            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                              {unread}
                            </span>
                          )}
                        </div>
                        {room.description && (
                          <p className="mt-1 text-[10px] text-slate-300/70 line-clamp-2">
                            {room.description}
                          </p>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-300/70">
                Conversations
              </h3>
              {uniqueWallets.length === 0 ? (
                <p className="text-xs text-slate-300/80">
                  No direct messages yet. Start a conversation from a help
                  request or plantation profile.
                </p>
              ) : (
                <ul className="space-y-1">
                  {uniqueWallets.map((wallet) => {
                    const unread = getUnreadCount(wallet);
                    const lastMessage = getDirectMessages(wallet, address ?? "")
                      .slice(-1)[0];
                    return (
                      <li key={wallet}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDirectWallet(wallet);
                            if (onSelectWallet) {
                              onSelectWallet(wallet);
                            }
                          }}
                          className={cn(
                            "w-full rounded-xl border p-3 text-left transition",
                            selectedDirectWallet === wallet
                              ? "border-leaf-400/60 bg-leaf-500/10"
                              : "border-slate-700/40 bg-slate-900/50 hover:border-slate-500/60"
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-xs font-semibold text-white">
                              {formatWalletAddress(wallet)}
                            </p>
                            {unread > 0 && (
                              <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">
                                {unread}
                              </span>
                            )}
                          </div>
                          {lastMessage && (
                            <p className="mt-1 text-[10px] text-slate-300/70 line-clamp-1">
                              {lastMessage.content}
                            </p>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </aside>

        <div className="flex flex-col rounded-2xl border border-slate-700/40 bg-slate-900/50">
          {view === "rooms" && !selectedRoomId ? (
            <div className="flex h-full items-center justify-center p-8">
              <p className="text-sm text-slate-300/80">
                Select a room to start chatting
              </p>
            </div>
          ) : view === "direct" && !selectedDirectWallet ? (
            <div className="flex h-full items-center justify-center p-8">
              <p className="text-sm text-slate-300/80">
                Select a conversation or start a new one
              </p>
            </div>
          ) : (
            <>
              <div className="border-b border-slate-700/40 p-4">
                <h3 className="text-sm font-semibold text-white">
                  {view === "rooms"
                    ? selectedRoom?.name
                    : selectedDirectWallet
                    ? `Chat with ${formatWalletAddress(selectedDirectWallet)}`
                    : "Select a conversation"}
                </h3>
                {selectedRoom?.description && (
                  <p className="mt-1 text-xs text-slate-300/70">
                    {selectedRoom.description}
                  </p>
                )}
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto p-4 max-h-[400px]">
                {currentMessages.length === 0 ? (
                  <p className="text-center text-sm text-slate-300/80">
                    No messages yet. Start the conversation!
                  </p>
                ) : (
                  currentMessages.map((msg) => {
                    const isOwn = msg.senderWalletAddress === address;
                    return (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex gap-3",
                          isOwn ? "flex-row-reverse" : "flex-row"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[75%] rounded-2xl px-4 py-2",
                            isOwn
                              ? "bg-leaf-500/20 text-leaf-200"
                              : "bg-slate-800/60 text-slate-100"
                          )}
                        >
                          <p className="text-xs font-semibold">
                            {isOwn ? "You" : getSenderName(msg)}
                          </p>
                          <p className="mt-1 text-sm">{msg.content}</p>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <ul className="mt-2 space-y-1">
                              {msg.attachments.map((url, idx) => (
                                <li key={idx}>
                                  <a
                                    href={url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-xs text-leaf-300 underline hover:text-leaf-200"
                                  >
                                    View attachment
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                          <p className="mt-1 text-[10px] text-slate-400/70">
                            {new Date(msg.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={handleSendMessage}
                className="border-t border-slate-700/40 p-4 space-y-2"
              >
                {attachments.length > 0 && (
                  <ul className="flex flex-wrap gap-2 text-xs text-slate-300/80">
                    {attachments.map((url) => (
                      <li
                        key={url}
                        className="flex items-center gap-2 rounded-full border border-slate-700/40 bg-slate-900/60 px-2 py-1"
                      >
                        <span className="truncate max-w-[120px]">{url}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setAttachments((prev) =>
                              prev.filter((u) => u !== url)
                            )
                          }
                          className="text-slate-400 hover:text-white"
                        >
                          ✕
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={attachmentUrl}
                    onChange={(event) => setAttachmentUrl(event.target.value)}
                    placeholder="Attachment URL (optional)"
                    className="flex-1 rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                  />
                  <button
                    type="button"
                    onClick={handleAddAttachment}
                    className="rounded-full border border-slate-600/40 bg-slate-900/70 px-3 py-2 text-xs font-semibold text-slate-200/90 transition hover:border-slate-400/60 hover:text-white"
                  >
                    Attach
                  </button>
                </div>
                <div className="flex gap-2">
                  <textarea
                    value={messageText}
                    onChange={(event) => setMessageText(event.target.value)}
                    rows={2}
                    placeholder="Type your message..."
                    className="flex-1 rounded-xl border border-slate-600/40 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 focus:border-leaf-500/60 focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
                    required
                  />
                  <button
                    type="submit"
                    disabled={!messageText.trim() || !address}
                    className="rounded-full bg-leaf-500 px-5 py-2 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-leaf-400 focus:outline-none focus:ring-2 focus:ring-leaf-300 focus:ring-offset-2 focus:ring-offset-slate-900/60 disabled:cursor-not-allowed disabled:bg-slate-700/40 disabled:text-slate-300/60"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}

