import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearChat, fetchAiData } from "../../redux/slice/aiSlice";
import { IoBagHandle, IoBagOutline } from "react-icons/io5";
import { BsChatDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FiLock, FiUser } from "react-icons/fi";
import { IoSparkles } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { Sparkle } from "lucide-react";

const SUGGESTIONS = [
  "What products do you have?",
  "Do you have medium sizes?",
  "Show me your bestsellers",
  "What are your prices?",
];

const RenderMessage = ({ content }) => {
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  const bareUrlRegex = /(https?:\/\/[^\s),]+)/g;

  const renderLine = (line) => {
    const segments = [];
    let lastIndex = 0;
    let match;

    const combinedRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)|(https?:\/\/[^\s),]+)/g;

    while ((match = combinedRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: "text", value: line.slice(lastIndex, match.index) });
      }

      if (match[1] && match[2]) {
        segments.push({ type: "link", label: match[1], url: match[2] });
      } else {
        segments.push({ type: "link", label: "View Product →", url: match[0] });
      }

      lastIndex = combinedRegex.lastIndex;
    }

    if (lastIndex < line.length) {
      segments.push({ type: "text", value: line.slice(lastIndex) });
    }

    return segments.map((seg, k) => {
      if (seg.type === "link") {
        return (
          <a
            key={k}
            href={seg.url}
            target="_blank"
            rel="noreferrer"
            className="text-amber-600 underline underline-offset-2 hover:text-amber-700 font-medium"
          >
            {seg.label}
          </a>
        );
      }
      const boldParts = seg.value.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={k}>
          {boldParts.map((p, j) =>
            j % 2 === 1
              ? <strong key={j} className="font-semibold">{p}</strong>
              : <span key={j}>{p}</span>
          )}
        </span>
      );
    });
  };

  return (
    <div className="flex flex-col gap-0.5 min-w-0 w-full">
      {content &&
        content.split("\n").map((line, i) => (
          <p key={i} className="m-0 leading-relaxed min-w-0">
            {renderLine(line)}
          </p>
        ))}
    </div>
  );
};

const TypingDots = () => (
  <div className="flex items-center gap-1 bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm w-fit">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 bg-stone-400 rounded-full animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </div>
);

const AiWidget = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { messages, loading, error } = useSelector((state) => state.ai);
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [showBadge, setShowBadge] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setShowBadge(false);
    }
  }, [isOpen]);

  const handleSend = (text) => {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    dispatch(fetchAiData({ message: trimmed, history }));
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <style>{`
        @keyframes windowIn {
          from { opacity:0; transform: scale(0.9) translateY(12px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }
        .chat-window-animate { animation: windowIn 0.3s cubic-bezier(.34,1.56,.64,1); }
        @keyframes bubbleIn {
          from { opacity:0; transform: translateY(8px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .bubble-animate { animation: bubbleIn 0.22s ease both; }
        .chat-scroll::-webkit-scrollbar { width: 5px; }
        .chat-scroll::-webkit-scrollbar-thumb { background: #d6d3d1; border-radius: 4px; }
      `}</style>

      <button
        onClick={() => setIsOpen((p) => !p)}
        className="cursor-pointer fixed bottom-14 right-7 w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-xl z-50 hover:bg-stone-800 hover:scale-105 transition-all duration-200"
        aria-label="Open chat"
      >
        {isOpen ? (
          <IoClose size={20} color="white" />
        ) : (
          <BsChatDots size={20} color="white" />
        )}

        {showBadge && !isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white animate-pulse">
            1
          </span>
        )}
      </button>

      {isOpen && (
        <div className="chat-window-animate fixed bottom-24 right-7 w-[360px] h-[530px] bg-stone-50 rounded-2xl shadow-2xl flex flex-col z-40 overflow-hidden border border-stone-200/70">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3.5 bg-stone-900">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-lg flex-shrink-0">
              <IoBagHandle size={18} color="white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-50 leading-tight">
                Store Assistant
              </p>
              <p className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                Online · Ask me anything
              </p>
            </div>
            <button
              onClick={() => dispatch(clearChat())}
              className="cursor-pointer text-[11px] text-stone-400 hover:text-stone-200 bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Auth banner */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-green-50 border-b border-green-200 text-[11.5px] text-green-800">
              <span>
                <FiUser size={13} className="text-green-700 flex-shrink-0" />
              </span>
              <span className="flex-1">
                Hi <strong>{user && user?.name?.split(" ")[0]}</strong> —
                personalized help enabled
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 border-b border-amber-200 text-[11.5px] text-amber-800">
              <span>
                <FiUser size={13} className="flex-shrink-0" />
              </span>
              <span className="flex-1">
                Browsing as guest — <strong>login</strong> for personalized help
              </span>
              <button
                onClick={() => navigate("/login")}
                className="cursor-pointer text-[11px] bg-stone-900 text-white px-2.5 py-1 rounded-md hover:bg-stone-700 transition-colors flex-shrink-0"
              >
                Login
              </button>
            </div>
          )}

          {/* Messages */}
          <div className="chat-scroll flex-1 overflow-y-auto px-3 py-3.5 flex flex-col gap-2.5">
            {/* Welcome */}
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center text-center px-4 pt-6 pb-2 gap-1.5">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-2xl mb-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-1">
                    <Sparkle size={24} color="white" />
                  </div>
                </div>
                <p className="text-base font-semibold text-stone-800">
                  Hi there!
                </p>
                <p className="text-xs text-stone-500 leading-relaxed max-w-[220px]">
                  Ask me about sizes, colors, prices, or anything about our
                  products.
                </p>
              </div>
            )}

            {/* Chat bubbles */}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`bubble-animate flex flex-col gap-1 ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] min-w-0 px-3.5 py-2.5 text-[13px] leading-relaxed break-words ${
                    msg.role === "user"
                      ? "bg-stone-900 text-stone-50 rounded-2xl rounded-br-sm"
                      : "bg-white text-stone-900 rounded-2xl rounded-bl-sm border border-stone-200 shadow-sm"
                  }`}
                >
                  {msg.role === "model" ? (
                    <RenderMessage content={msg.content} />
                  ) : (
                    msg.content
                  )}
                </div>

                {/* Action after last model reply */}
                {msg.role === "model" &&
                  i === messages.length - 1 &&
                  (isLoggedIn ? (
                    <button
                      onClick={() => navigate("/collections/all")}
                      className="text-[12px] bg-stone-900 text-white px-3.5 py-1.5 rounded-lg hover:bg-stone-700 transition-colors mt-0.5 flex items-center gap-1.5"
                    >
                      <IoBagOutline size={13} />
                      Browse Products
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 max-w-[90%] mt-0.5">
                      <span className="text-[12px] text-amber-800 flex-1">
                        <FiLock
                          size={12}
                          className="text-amber-800 flex-shrink-0"
                        />{" "}
                        Login to add items to cart
                      </span>
                      <button
                        onClick={() => navigate("/login")}
                        className="cursor-pointer text-[11px] bg-stone-900 text-white px-2.5 py-1 rounded-md hover:bg-stone-700 transition-colors flex-shrink-0"
                      >
                        Login
                      </button>
                    </div>
                  ))}

                <span className="text-[10px] text-stone-400 px-1">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="bubble-animate flex flex-col items-start">
                <TypingDots />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-xs text-red-500 text-center bg-red-50 border border-red-200 rounded-lg px-3 py-2 break-words w-full">
                {error}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips — only when empty */}
          {messages.length === 0 && !loading && (
            <div className="px-3 pb-2.5 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="cursor-pointer text-[11.5px] text-stone-600 bg-white border border-stone-200 rounded-full px-3 py-1.5 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-150"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input area */}
          <div className="px-3 pt-2.5 pb-3 border-t border-stone-200 bg-stone-50">
            <div className="flex gap-2 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about our products..."
                disabled={loading}
                className="flex-1 border border-stone-300 rounded-xl px-3.5 py-2.5 text-[13px] text-stone-900 bg-white outline-none focus:border-stone-700 transition-colors placeholder:text-stone-400 disabled:bg-stone-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="cursor-pointer w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center flex-shrink-0 hover:bg-stone-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all hover:scale-105 disabled:scale-100"
              >
                {loading ? (
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="2"
                      strokeDasharray="40"
                      strokeDashoffset="10"
                    />
                  </svg>
                ) : (
                  <IoSend size={16} color="white" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-stone-400 text-center mt-1.5">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default AiWidget;
