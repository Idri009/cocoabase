"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";
import type { Plantation } from "@/store/plantations";
import type { HelpRequest } from "@/store/help-requests";
import type { ChatRoom } from "@/store/farmer-chat";

type SearchResult = {
  id: string;
  type: "plantation" | "help_request" | "chat_room" | "task";
  title: string;
  description?: string;
  metadata?: string;
  onClick: () => void;
};

type GlobalSearchProps = {
  plantations: Plantation[];
  helpRequests?: HelpRequest[];
  chatRooms?: ChatRoom[];
  onPlantationSelect?: (id: string) => void;
  onHelpRequestSelect?: (id: string) => void;
  onChatRoomSelect?: (id: string) => void;
};

export default function GlobalSearch({
  plantations,
  helpRequests = [],
  chatRooms = [],
  onPlantationSelect,
  onHelpRequestSelect,
  onChatRoomSelect,
}: GlobalSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    plantations.forEach((plantation) => {
      const matchesName = plantation.seedName.toLowerCase().includes(searchTerm);
      const matchesLocation = plantation.location?.toLowerCase().includes(searchTerm);
      const matchesNotes = plantation.notes?.toLowerCase().includes(searchTerm);

      if (matchesName || matchesLocation || matchesNotes) {
        searchResults.push({
          id: plantation.id,
          type: "plantation",
          title: plantation.seedName,
          description: plantation.location,
          metadata: `${plantation.stage} • ${plantation.treeCount} trees`,
          onClick: () => {
            onPlantationSelect?.(plantation.id);
            setIsOpen(false);
            setQuery("");
          },
        });
      }

      plantation.tasks.forEach((task) => {
        if (task.title.toLowerCase().includes(searchTerm)) {
          searchResults.push({
            id: task.id,
            type: "task",
            title: task.title,
            description: `Task for ${plantation.seedName}`,
            metadata: `${task.status} • Due ${new Date(task.dueDate).toLocaleDateString()}`,
            onClick: () => {
              onPlantationSelect?.(plantation.id);
              setIsOpen(false);
              setQuery("");
            },
          });
        }
      });
    });

    helpRequests.forEach((request) => {
      const matchesTitle = request.title.toLowerCase().includes(searchTerm);
      const matchesDescription = request.description.toLowerCase().includes(searchTerm);
      const matchesCategory = request.category.toLowerCase().includes(searchTerm);

      if (matchesTitle || matchesDescription || matchesCategory) {
        searchResults.push({
          id: request.id,
          type: "help_request",
          title: request.title,
          description: request.description.slice(0, 100),
          metadata: `${request.category} • ${request.status}`,
          onClick: () => {
            onHelpRequestSelect?.(request.id);
            setIsOpen(false);
            setQuery("");
          },
        });
      }
    });

    chatRooms.forEach((room) => {
      const matchesName = room.name.toLowerCase().includes(searchTerm);
      const matchesDescription = room.description?.toLowerCase().includes(searchTerm);

      if (matchesName || matchesDescription) {
        searchResults.push({
          id: room.id,
          type: "chat_room",
          title: room.name,
          description: room.description,
          metadata: `${room.memberCount} members`,
          onClick: () => {
            onChatRoomSelect?.(room.id);
            setIsOpen(false);
            setQuery("");
          },
        });
      }
    });

    return searchResults.slice(0, 10);
  }, [query, plantations, helpRequests, chatRooms, onPlantationSelect, onHelpRequestSelect, onChatRoomSelect]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }

      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setQuery("");
      }

      if (isOpen && results.length > 0) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % results.length);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        }
        if (event.key === "Enter" && selectedIndex >= 0) {
          event.preventDefault();
          results[selectedIndex]?.onClick();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  useEffect(() => {
    if (isOpen && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [selectedIndex, isOpen]);

  const typeIcons: Record<SearchResult["type"], string> = {
    plantation: "🌱",
    help_request: "🆘",
    chat_room: "💬",
    task: "📋",
  };

  const typeLabels: Record<SearchResult["type"], string> = {
    plantation: "Plantation",
    help_request: "Help Request",
    chat_room: "Chat Room",
    task: "Task",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-full border border-slate-600/40 bg-slate-900/60 px-4 py-2 text-sm text-slate-300/80 transition hover:border-slate-400/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-leaf-400/40"
      >
        <span>🔍</span>
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden rounded bg-slate-800/80 px-2 py-0.5 text-xs font-mono text-slate-400 sm:inline">
          ⌘K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setIsOpen(false);
                setQuery("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed left-1/2 top-1/4 z-[10000] w-full max-w-2xl -translate-x-1/2"
            >
              <div className="mx-4 rounded-2xl border border-slate-700/60 bg-[#101f3c] shadow-2xl shadow-black/40">
                <div className="flex items-center gap-3 border-b border-slate-700/40 p-4">
                  <span className="text-xl">🔍</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Search plantations, tasks, help requests, chat rooms..."
                    className="flex-1 bg-transparent text-slate-100 placeholder:text-slate-400/60 focus:outline-none"
                    autoFocus
                  />
                  <kbd className="rounded bg-slate-800/80 px-2 py-1 text-xs font-mono text-slate-400">
                    ESC
                  </kbd>
                </div>

                {results.length > 0 ? (
                  <div
                    ref={resultsRef}
                    className="max-h-96 overflow-y-auto p-2"
                  >
                    {results.map((result, index) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        type="button"
                        onClick={result.onClick}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left transition",
                          index === selectedIndex
                            ? "border-leaf-400/60 bg-leaf-500/10"
                            : "border-transparent bg-transparent hover:border-slate-700/40 hover:bg-slate-900/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{typeIcons[result.type]}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-white">
                                {result.title}
                              </p>
                              <span className="rounded-full bg-slate-800/80 px-2 py-0.5 text-[10px] text-slate-300/70">
                                {typeLabels[result.type]}
                              </span>
                            </div>
                            {result.description && (
                              <p className="mt-1 text-xs text-slate-300/70 line-clamp-1">
                                {result.description}
                              </p>
                            )}
                            {result.metadata && (
                              <p className="mt-1 text-[10px] text-slate-400/70">
                                {result.metadata}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : query.trim() ? (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-300/80">
                      No results found for "{query}"
                    </p>
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-sm text-slate-300/80">
                      Start typing to search...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

