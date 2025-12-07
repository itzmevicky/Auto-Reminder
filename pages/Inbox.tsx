import React, { useState, useRef, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical, Sparkles, CheckCheck, Menu, Phone, Video } from 'lucide-react';
import { Conversation, Message } from '../types';
import { api } from '../services/api';
import { suggestReply } from '../services/geminiService';

export const Inbox: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [showListOnMobile, setShowListOnMobile] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await api.getConversations();
        setConversations(data);
        if (data.length > 0) {
            setActiveConvId(data[0].contactId);
        }
      } catch (e) {
        console.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };
    loadConversations();
  }, []);

  const activeConversation = conversations.find(c => c.contactId === activeConvId);

  useEffect(() => {
    if (activeConversation) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeConversation, activeConversation?.messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConversation) return;
    
    const tempId = Date.now().toString();
    const newMessage: Message = {
      id: tempId,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    // Optimistic update
    const updatedConvs = conversations.map(c => {
      if (c.contactId === activeConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: inputText,
          updatedAt: 'Just now'
        };
      }
      return c;
    });

    setConversations(updatedConvs);
    setInputText('');

    try {
        await api.sendMessage(activeConversation.contactId, newMessage.text);
    } catch (e) {
        // Rollback on error (simplified for this demo)
        console.error("Failed to send message");
    }
  };

  const handleAISuggestion = async () => {
    if (!activeConversation) return;
    setIsSuggesting(true);
    
    const history = activeConversation.messages.slice(-5).map(m => 
      `${m.sender === 'user' ? 'Me' : 'Customer'}: ${m.text}`
    ).join('\n');

    const suggestion = await suggestReply(history);
    if(suggestion) setInputText(suggestion);
    setIsSuggesting(false);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConvId(id);
    setShowListOnMobile(false);
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative isolate">
      {/* Sidebar List */}
      <div className={`
        w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-white z-20 
        absolute md:relative h-full transition-transform duration-300 ease-in-out
        ${showListOnMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-sm shrink-0">
          <h3 className="font-bold text-xl text-slate-900 mb-4">Messages</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search chats..." 
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder:text-slate-400"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {isLoading ? (
             Array(4).fill(0).map((_, i) => (
                 <div key={i} className="p-4 rounded-xl animate-pulse flex gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0"></div>
                    <div className="flex-1 space-y-2">
                        <div className="w-24 h-4 bg-slate-100 rounded"></div>
                        <div className="w-full h-3 bg-slate-50 rounded"></div>
                    </div>
                 </div>
             ))
          ) : conversations.map((conv) => (
            <div 
              key={conv.contactId}
              onClick={() => handleSelectConversation(conv.contactId)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 group border border-transparent ${
                activeConvId === conv.contactId 
                ? 'bg-indigo-50/80 border-indigo-100 shadow-sm' 
                : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <h4 className={`font-bold text-sm ${activeConvId === conv.contactId ? 'text-indigo-900' : 'text-slate-900'}`}>{conv.contactName}</h4>
                <span className={`text-[10px] font-medium ${activeConvId === conv.contactId ? 'text-indigo-400' : 'text-slate-400'}`}>{conv.updatedAt}</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <p className={`text-sm truncate flex-1 font-medium ${activeConvId === conv.contactId ? 'text-indigo-600/80' : 'text-slate-500'}`}>{conv.lastMessage}</p>
                {conv.unreadCount > 0 && (
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-lg shadow-indigo-500/30">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col w-full h-full bg-[#F8FAFC] min-w-0 relative z-10">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 flex justify-between items-center shadow-sm shrink-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                    className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800" 
                    onClick={() => setShowListOnMobile(true)}
                >
                    <Menu size={20}/>
                </button>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-200 flex items-center justify-center font-bold text-indigo-700 shrink-0 shadow-inner">
                  {activeConversation.contactName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{activeConversation.contactName}</h3>
                  <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                    {activeConversation.isOnline && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>}
                    {activeConversation.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                 <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                    <Phone size={20} />
                 </button>
                 <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                    <Video size={20} />
                 </button>
                 <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors">
                    <MoreVertical size={20} />
                 </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeConversation.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] md:max-w-[65%] rounded-2xl p-4 shadow-sm relative text-sm md:text-base leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-200' 
                      : 'bg-white text-slate-700 rounded-tl-none border border-slate-100 shadow-slate-200'
                  }`}>
                    <p>{msg.text}</p>
                    <div className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] font-medium ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'user' && (
                        <CheckCheck size={14} className="text-indigo-200" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              <div className="relative flex items-end gap-2 w-full">
                <button className="p-3 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50 mb-1 hidden sm:block transition-colors">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-400 transition-all flex flex-col shadow-inner">
                  {/* AI Suggestion Chip */}
                  {inputText.length === 0 && (
                    <div className="px-3 pt-2">
                      <button 
                         onClick={handleAISuggestion}
                         disabled={isSuggesting}
                         className="text-xs flex items-center gap-1.5 text-indigo-600 bg-indigo-100/50 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors w-fit font-medium"
                      >
                         <Sparkles size={12} className={isSuggesting ? 'animate-pulse' : ''} />
                         {isSuggesting ? 'Generating suggestion...' : 'Auto-suggest reply'}
                      </button>
                    </div>
                  )}
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if(e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="w-full bg-transparent border-none focus:ring-0 resize-none p-3 max-h-32 text-slate-800 placeholder:text-slate-400"
                    rows={1}
                  />
                </div>
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputText.trim()}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20 active:scale-95 mb-1"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50/50">
            <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-slate-200 border border-slate-100 transform rotate-12">
              <Send size={40} className="opacity-80 text-indigo-500 -rotate-12" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Your Inbox</h3>
            <p className="mt-2 text-slate-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};
