import React, { useEffect, useMemo, useRef, useState } from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import profile from "../assets/cat.jpg";
import HeaderBar from "@/components/HeaderBar";
import NavBar from "@/components/NavBar";
import { cats as CATS } from "../data/cats";

/* === CONFIG: 10 seconds to move to Past === */
const CHAT_EXPIRY_MS = 10 * 1000;

/* Session persistence (survives route changes; clears when tab closes) */
const SESSION_KEY = "catter_session_chats_v1";

/* Likes queue used by the swiper to buffer likes before Chats mounts */
const SWIPE_QUEUE_KEY = "catter_swipe_queue";

/* Helpers */
const catsByName = Object.fromEntries(CATS.map((c) => [c.name, c]));
const loadChats = () => {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveChats = (chats) =>
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(chats));

/* UI row */
const ChatCard = ({
  catName,
  lastMessage,
  ownerName,
  address,
  onClick,
  selectionMode = false,
  checked = false,
  onCheckToggle = () => {},
}) => {
  const meta = catsByName[catName] || {};
  const img = meta.image || profile;
  const displayOwner = ownerName || "owner's name";
  const displayAddr = address || meta.location || "address";

  return (
    <div
      className="relative border rounded-lg px-4 py-2 shadow-sm hover:bg-gray-50 transition cursor-pointer flex justify-between items-center"
      onClick={() => {
        if (selectionMode) onCheckToggle(catName);
        else onClick?.();
      }}
    >
      {selectionMode && (
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => {
            e.stopPropagation();
            onCheckToggle(catName);
          }}
          className="absolute top-2 left-2 w-4 h-4 accent-purple-600"
          aria-label={`Select ${catName}`}
        />
      )}

      <div className={`flex items-start space-x-4 ${selectionMode ? "pl-6" : ""}`}>
        <Avatar className="w-10 h-10 border border-gray-300">
          <AvatarImage src={img} alt={catName} />
        </Avatar>
        <div>
          <p className="font-semibold text-left">{catName}</p>
          <p className="text-sm text-gray-500 ml-[1rem]">{lastMessage || "Say hi!"}</p>
        </div>
      </div>

      <div className="text-sm text-gray-500 text-right">
        <p>{displayOwner}</p>
        <p>{displayAddr}</p>
      </div>
    </div>
  );
};

const ProfileTab = ({ name }) => {
  const c = catsByName[name] || {};
  return (
    <div className="px-4 py-6 space-y-3">
      <div className="flex items-start space-x-4">
        <Avatar className="w-16 h-16 border border-gray-300">
          <AvatarImage src={c.image || profile} alt={c.name || name} />
        </Avatar>
        <div>
          <h3 className="text-xl font-semibold">{c.name || name}</h3>
          <p className="text-gray-600">{c.shortDescription}</p>
          <p className="text-gray-500">{c.location}</p>
        </div>
      </div>

      <div className="text-gray-800">
        <div className="font-medium mb-1">About</div>
        <p className="text-sm">{c.about || "No description provided."}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="border rounded-lg p-3">
          <div className="text-gray-500">Breed</div>
          <div className="font-medium">{c.breed || "—"}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-gray-500">Age</div>
          <div className="font-medium">{c.age != null ? `${c.age} yrs` : "—"}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-gray-500">Color</div>
          <div className="font-medium">{c.color || "—"}</div>
        </div>
        <div className="border rounded-lg p-3">
          <div className="text-gray-500">Weight</div>
          <div className="font-medium">{c.weight || "—"}</div>
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  // Collapsibles
  const [showActive, setShowActive] = useState(true);
  const [showAll, setShowAll] = useState(false);

  // Drawer state
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState("chat");
  const [draft, setDraft] = useState("");
  const messagesEndRef = useRef(null);

  // Selection mode & success
  const [selectMode, setSelectMode] = useState(false);
  const [selectedCats, setSelectedCats] = useState({});
  const [successPage, setSuccessPage] = useState(false);

  // In-session chats (persisted in sessionStorage)
  // { id, name, createdAt, lastMessageAt, status: 'active'|'past', messages: [] }
  const [chats, setChats] = useState(() => loadChats());

  // Persist to sessionStorage whenever chats change
  useEffect(() => saveChats(chats), [chats]);

  /* Helper to add or promote a single name */
  const addOrPromote = (prev, name, ts = Date.now()) => {
    const i = prev.findIndex((c) => c.name === name);
    if (i >= 0) {
      const copy = [...prev];
      copy[i] = { ...copy[i], status: "active" };
      return copy;
    }
    return [
      {
        id: crypto.randomUUID(),
        name,
        createdAt: ts,
        lastMessageAt: null,
        status: "active",
        messages: [],
      },
      ...prev,
    ];
  };

  /* Demote to Past after 10s of inactivity */
  useEffect(() => {
    const t = setInterval(() => {
      const now = Date.now();
      setChats((prev) => {
        let changed = false;
        const next = prev.map((c) => {
          const last = c.lastMessageAt ?? c.createdAt;
          const shouldActive = now - last <= CHAT_EXPIRY_MS;
          if ((c.status === "active") !== shouldActive) {
            changed = true;
            return { ...c, status: shouldActive ? "active" : "past" };
          }
          return c;
        });
        return changed ? next : prev;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  /* Import likes done before opening/returning to Chats */
  const seedFromQueue = () => {
    try {
      const raw = sessionStorage.getItem(SWIPE_QUEUE_KEY);
      if (!raw) return;
      const q = JSON.parse(raw); // [{name, ts}, ...]
      if (!Array.isArray(q) || q.length === 0) return;

      setChats((prev) => {
        let res = prev;
        q.forEach(({ name, ts }) => {
          if (name) res = addOrPromote(res, name, ts || Date.now());
        });
        return res;
      });

      sessionStorage.removeItem(SWIPE_QUEUE_KEY); // consumed
    } catch {}
  };

  useEffect(() => {
    seedFromQueue(); // on mount
    const onVisible = () =>
      document.visibilityState === "visible" && seedFromQueue();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", seedFromQueue);
    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", seedFromQueue);
    };
  }, []);

  /* Live: add a like immediately when Chats is mounted */
  useEffect(() => {
    const onSwipeRight = (e) => {
      const name = e.detail?.name;
      if (!name) return;
      setChats((prev) => addOrPromote(prev, name));
    };
    window.addEventListener("catter:swipeRight", onSwipeRight);
    return () => window.removeEventListener("catter:swipeRight", onSwipeRight);
  }, []);

  /* Sections from explicit status */
  const activeChats = useMemo(() => chats.filter((c) => c.status === "active"), [chats]);
  const past = useMemo(() => chats.filter((c) => c.status === "past"), [chats]);

  // Current chat
  const current = chats.find((c) => c.name === selectedChat);
  const currentMsgs = current?.messages || [];
  useEffect(() => {
    if (!selectedChat) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedChat, currentMsgs.length]);

  const openChat = (cat) => {
    if (selectMode || successPage) return;
    setSelectedChat(cat);
    setActiveTab("chat");
    setDraft("");
  };

  const sendMessage = () => {
    const text = draft.trim();
    if (!text || !current) return;
    const ts = Date.now();
    setChats((prev) =>
      prev.map((c) =>
        c.id === current.id
          ? {
              ...c,
              lastMessageAt: ts,
              status: "active", // promote on message
              messages: [...c.messages, { from: "me", text, ts }],
            }
          : c
      )
    );
    setDraft("");
  };

  /* Adopt flow */
  const adoptableNames = useMemo(() => chats.map((c) => c.name), [chats]);
  const selectedCount = useMemo(
    () => Object.values(selectedCats).filter(Boolean).length,
    [selectedCats]
  );
  const toggleCheck = (cat) => setSelectedCats((p) => ({ ...p, [cat]: !p[cat] }));
  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedCats({});
  };
  const handleDone = () => {
    if (selectedCount === 0) return;
    setSuccessPage(true);
    setSelectMode(false);
    setSelectedCats({});
  };
  useEffect(() => {
    if (!successPage) return;
    const t = setTimeout(() => setSuccessPage(false), 1200);
    return () => clearTimeout(t);
  }, [successPage]);

  return (
    <>
      <HeaderBar />

      {/* CHAT SUBPAGE */}
      {selectedChat && !successPage && !selectMode ? (
        <>
          <div className="sticky z-30 bg-white" style={{ top: "64px" }}>
            <div className="relative px-4 py-3 border-b">
              <button
                onClick={() => setSelectedChat(null)}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-black hover:text-gray-700"
                aria-label="Back to Chats"
              >
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>
              <h2 className="text-center text-3xl font-bold">{selectedChat}</h2>
            </div>

            <div className="flex h-11 bg-white border-b">
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 text-center font-medium relative ${
                  activeTab === "chat" ? "text-black" : "text-gray-400"
                }`}
              >
                Chat
                {activeTab === "chat" && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-black block" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 text-center font-medium relative ${
                  activeTab === "profile" ? "text-black" : "text-gray-400"
                }`}
              >
                Profile
                {activeTab === "profile" && (
                  <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-black block" />
                )}
              </button>
            </div>
          </div>

          {activeTab === "chat" ? (
            <div className="px-4 pt-24 pb-36">
              <div className="flex flex-col space-y-2">
                {currentMsgs.map((m, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      m.from === "me"
                        ? "self-end bg-purple-600 text-white"
                        : "self-start bg-gray-200 text-gray-900"
                    }`}
                  >
                    {m.text}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
          ) : (
            <div className="pt-6 pb-24">
              <ProfileTab name={selectedChat} />
            </div>
          )}

          <div className="fixed bottom-16 left-0 w-full bg-white border-t px-3 py-3">
            <div className="flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border rounded-full px-4 py-2 outline-none"
                placeholder="Type a message"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 rounded-full bg-purple-600 text-white font-medium"
              >
                Send
              </button>
            </div>
          </div>
        </>
      ) : successPage ? (
        <div className="text-center text-xl mt-20 text-gray-600 pb-24">
          <div className="text-3xl font-semibold mb-3">Success ✅</div>
          <div>Your adoption request has been submitted.</div>
        </div>
      ) : (
        <div className="px-15 mt-9 pb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-5xl font-sami-bold text-left">Chats</h2>
            <button
              onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))}
              className={`px-4 py-2 rounded-lg text-sm font-medium border ${
                selectMode ? "bg-gray-700 text-white border-gray-700" : "bg-gray-200 text-gray-800 border-gray-300"
              }`}
            >
              {selectMode ? "Cancel" : "Adopt a Cat"}
            </button>
          </div>

          {selectMode ? (
            <>
              {adoptableNames.length === 0 ? (
                <div className="text-gray-500 px-4">No chats yet. Swipe right on a cat first.</div>
              ) : (
                <div className="space-y-3">
                  {adoptableNames.map((cat) => (
                    <ChatCard
                      key={cat}
                      catName={cat}
                      lastMessage=""
                      ownerName="owner's name"
                      address={catsByName[cat]?.location}
                      selectionMode
                      checked={!!selectedCats[cat]}
                      onCheckToggle={toggleCheck}
                    />
                  ))}
                </div>
              )}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleDone}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-60"
                  disabled={selectedCount === 0}
                >
                  Done
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              {/* Active chats */}
              <div className="border-b pb-3">
                <div
                  className="flex justify-between items-center cursor-pointer pl-10"
                  onClick={() => setShowActive(!showActive)}
                >
                  <p className="text-lg font-regular text-left">Active chats ({activeChats.length})</p>
                  {showActive ? <ChevronUp size={25} /> : <ChevronDown size={25} />}
                </div>
                {showActive && (
                  <div className="mt-3 space-y-3 w-full">
                    {activeChats.map((c) => (
                      <ChatCard
                        key={c.id}
                        catName={c.name}
                        lastMessage={c.messages.at(-1)?.text}
                        ownerName="owner's name"
                        address={catsByName[c.name]?.location}
                        onClick={() => openChat(c.name)}
                      />
                    ))}
                    {activeChats.length === 0 && (
                      <div className="text-sm text-gray-500 ml-2">No active chats yet.</div>
                    )}
                  </div>
                )}
              </div>

              {/* Past chats */}
              <div className="border-b pb-3">
                <div
                  className="flex justify-between items-center cursor-pointer pl-10"
                  onClick={() => setShowAll(!showAll)}
                >
                  <p className="text-lg font-regular text-left">Past chats ({past.length})</p>
                  {showAll ? <ChevronUp size={25} /> : <ChevronDown size={25} />}
                </div>
                {showAll && (
                  <div className="mt-3 space-y-3 w-full">
                    {past.map((c) => (
                      <ChatCard
                        key={c.id}
                        catName={c.name}
                        lastMessage={c.messages.at(-1)?.text}
                        ownerName="owner's name"
                        address={catsByName[c.name]?.location}
                        onClick={() => openChat(c.name)}
                      />
                    ))}
                    {past.length === 0 && (
                      <div className="text-sm text-gray-500 ml-2">No past chats.</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <NavBar />
    </>
  );
};

export default ChatPage;
