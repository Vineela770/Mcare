import { useState, useRef, useEffect, useCallback } from 'react';
import Sidebar from '../../components/common/Sidebar';
import employerService from '../../api/employerService';

import {
  Search,
  Send,
  MoreVertical,
  Paperclip,
  FileText,
  Image,
  Camera,
  Headphones,
} from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null); // full conv object
  const [messageText, setMessageText] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const messagesEndRef = useRef(null);
  const documentInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const currentUserId = (() => {
    try { return JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '')).id; }
    catch { return null; }
  })();

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const data = await employerService.getConversations();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    fetchMessages(selectedChat.other_id);
  }, [selectedChat?.other_id]);

  const fetchMessages = async (otherUserId) => {
    try {
      const data = await employerService.getMessages(otherUserId);
      setMessages(data.messages || []);
      // Mark as read locally
      setConversations(prev =>
        prev.map(c => c.other_id === otherUserId ? { ...c, unread_count: 0 } : c)
      );
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setMessages([]);
    }
  };

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Search candidates
  const handleSearch = useCallback(async (q) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const data = await employerService.searchCandidates(q);
      setSearchResults(data.candidates || []);
    } catch (err) {
      console.error('Search error:', err);
    }
  }, []);

  const openFilePicker = (type) => {
    setShowAttachments(false);
    if (type === 'document') documentInputRef.current.click();
    if (type === 'media') mediaInputRef.current.click();
    if (type === 'audio') audioInputRef.current.click();
    if (type === 'camera') cameraInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log('Selected file:', file);
  };

  const selectConversation = (conv) => {
    setSelectedChat(conv);
    setIsSearching(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const startConversationWith = (candidate) => {
    const existing = conversations.find(c => c.other_id === candidate.id);
    if (existing) {
      selectConversation(existing);
    } else {
      selectConversation({
        other_id: candidate.id,
        candidate_name: candidate.name,
        photo: candidate.photo,
        last_message: '',
        last_time: '',
        unread_count: 0,
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat || sending) return;

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    const optimistic = {
      id: `tmp-${Date.now()}`,
      sender_id: currentUserId,
      message_text: text,
      sent_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      await employerService.sendMessage({
        receiver_id: selectedChat.other_id,
        message_text: text,
      });
      await fetchMessages(selectedChat.other_id);
      await fetchConversations();
    } catch (error) {
      console.error('Failed to send message:', error);
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setMessageText(text);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <Sidebar />

      {/* Hidden File Inputs */}
      <input type="file" ref={documentInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" accept="image/*,video/*" ref={mediaInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileSelect} className="hidden" />

      <div className="md:ml-64 min-h-screen bg-gray-50 p-4 pt-20 md:pt-6 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
          Messages
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-160px)] md:h-[calc(100vh-200px)]">
          <div className="flex h-full">

            {/* ================= LEFT PANEL ================= */}
            <div
              className={`${
                selectedChat ? 'hidden md:flex' : 'flex'
              } w-full md:w-1/3 border-r flex-col`}
            >
              <div className="p-3 md:p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Search Results */}
                {isSearching && searchResults.length > 0 && (
                  <div className="border-b">
                    <p className="text-xs text-gray-400 px-4 py-2 bg-gray-50">Search Results</p>
                    {searchResults.map(c => (
                      <div
                        key={c.id}
                        onClick={() => startConversationWith(c)}
                        className="p-3 md:p-4 cursor-pointer border-b hover:bg-gray-50 flex items-center gap-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                          {c.photo
                            ? <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                            : c.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.title || 'Candidate'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {isSearching && searchResults.length === 0 && (
                  <p className="text-center text-gray-400 text-sm py-6">No candidates found</p>
                )}

                {/* Conversations */}
                {!isSearching && (
                  <>
                    {loading && <p className="text-center text-gray-400 text-sm py-6">Loading...</p>}
                    {!loading && conversations.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-6">
                        No conversations yet. Search above to message a candidate.
                      </p>
                    )}
                    {conversations.map(conv => (
                      <div
                        key={conv.other_id}
                        onClick={() => selectConversation(conv)}
                        className={`p-3 md:p-4 cursor-pointer border-b hover:bg-gray-50 ${
                          selectedChat?.other_id === conv.other_id ? 'bg-cyan-50' : ''
                        }`}
                      >
                        <div className="flex justify-between">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden flex-shrink-0">
                              {conv.photo
                                ? <img src={conv.photo} alt={conv.candidate_name} className="w-full h-full object-cover" />
                                : conv.candidate_name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-semibold text-sm md:text-base truncate">
                                {conv.candidate_name}
                              </h3>
                              <p className="text-xs md:text-sm text-gray-600 truncate">
                                {conv.last_message || '—'}
                              </p>
                              <p className="text-xs text-gray-400">{conv.last_time || ''}</p>
                            </div>
                          </div>

                          {conv.unread_count > 0 && (
                            <span className="bg-cyan-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 self-start mt-1">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>

              {!selectedChat ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Send className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Select a conversation or search for a candidate</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="p-3 md:p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="md:hidden text-gray-600"
                      >
                        ←
                      </button>

                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold overflow-hidden">
                        {selectedChat.photo
                          ? <img src={selectedChat.photo} alt={selectedChat.candidate_name} className="w-full h-full object-cover" />
                          : selectedChat.candidate_name?.charAt(0)?.toUpperCase()}
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm md:text-base">
                          {selectedChat.candidate_name}
                        </h3>
                        <p className="text-xs text-gray-500">Candidate</p>
                      </div>
                    </div>

                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
                    {messages.length === 0 && (
                      <p className="text-center text-gray-400 text-sm py-6">No messages yet. Say hello!</p>
                    )}
                    {messages.map(msg => {
                      const isOwn = msg.sender_id === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] md:max-w-md px-3 md:px-4 py-2 rounded-lg text-sm ${
                              isOwn
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                                : 'bg-gray-100'
                            }`}
                          >
                            <p>{msg.message_text}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-cyan-100' : 'text-gray-400'}`}>
                              {formatTime(msg.sent_at)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="relative p-3 md:p-4 border-t flex gap-2 items-center"
                  >
                    <button
                      type="button"
                      onClick={() => setShowAttachments(prev => !prev)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>

                    {showAttachments && (
                      <div className="absolute bottom-16 left-3 md:left-4 bg-white border rounded-xl shadow-lg w-52 z-50">
                        {[
                          { label: 'Document', icon: FileText, type: 'document' },
                          { label: 'Photos & videos', icon: Image, type: 'media' },
                          { label: 'Camera', icon: Camera, type: 'camera' },
                          { label: 'Audio', icon: Headphones, type: 'audio' },
                        ].map(item => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => openFilePicker(item.type)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base"
                    />

                    <button
                      type="submit"
                      disabled={sending || !messageText.trim()}
                      className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;

import {
  Search,
  Send,
  MoreVertical,
  Paperclip,
  FileText,
  Image,
  Camera,
  Headphones,
} from 'lucide-react';

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const documentInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true);
      try {
        const data = await employerService.getConversations();
        const convsArray = Array.isArray(data) ? data : [];
        // Map backend data to expected format
        const mappedConvs = convsArray.map(conv => ({
          id: conv.id,
          name: conv.candidate_name || 'Unknown',
          lastMessage: conv.last_message || 'No messages yet',
          time: conv.last_time ? new Date(conv.last_time).toLocaleString() : '',
          unread: 0, // Backend doesn't track unread yet
          avatar: (conv.candidate_name || 'U').substring(0, 2).toUpperCase(),
        }));
        setConversations(mappedConvs);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const data = await employerService.getMessages(selectedChat);
        const msgsArray = Array.isArray(data) ? data : [];
        // Map backend data to expected format
        const mappedMsgs = msgsArray.map(msg => ({
          id: msg.id,
          text: msg.message,
          time: msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : '',
          isOwn: msg.sender === 'hr', // Messages from HR are "own"
        }));
        setMessages(mappedMsgs);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        setMessages([]);
      }
    };
    fetchMessages();
  }, [selectedChat]);

  const openFilePicker = (type) => {
    setShowAttachments(false);
    if (type === 'document') documentInputRef.current.click();
    if (type === 'media') mediaInputRef.current.click();
    if (type === 'audio') audioInputRef.current.click();
    if (type === 'camera') cameraInputRef.current.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    console.log('Selected file:', file);
  };

  const activeChat = conversations.find(c => c.id === selectedChat);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    try {
      await employerService.sendMessage({
        conversation_id: selectedChat,
        message: messageText,
      });
      setMessageText('');
      // Refresh messages after sending
      const data = await employerService.getMessages(selectedChat);
      const msgsArray = Array.isArray(data) ? data : [];
      const mappedMsgs = msgsArray.map(msg => ({
        id: msg.id,
        text: msg.message,
        time: msg.created_at ? new Date(msg.created_at).toLocaleTimeString() : '',
        isOwn: msg.sender === 'hr',
      }));
      setMessages(mappedMsgs);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div>
      <Sidebar />

      {/* Hidden File Inputs */}
      <input type="file" ref={documentInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" accept="image/*,video/*" ref={mediaInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" accept="audio/*" ref={audioInputRef} onChange={handleFileSelect} className="hidden" />
      <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileSelect} className="hidden" />

      {/* ✅ Responsive Wrapper */}
      <div className="md:ml-64 min-h-screen bg-gray-50 p-4 pt-20 md:pt-6 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">
          Messages
        </h1>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-160px)] md:h-[calc(100vh-200px)]">
          <div className="flex h-full">

            {/* ================= LEFT PANEL ================= */}
            <div
              className={`${
                selectedChat ? 'hidden md:flex' : 'flex'
              } w-full md:w-1/3 border-r flex-col`}
            >
              <div className="p-3 md:p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm md:text-base"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`p-3 md:p-4 cursor-pointer border-b hover:bg-gray-50 ${
                      selectedChat === chat.id ? 'bg-cyan-50' : ''
                    }`}
                  >
                    <div className="flex justify-between">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                          {chat.avatar}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm md:text-base">
                            {chat.name}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 truncate">
                            {chat.lastMessage}
                          </p>
                          <p className="text-xs text-gray-400">{chat.time}</p>
                        </div>
                      </div>

                      {chat.unread > 0 && (
                        <span className="bg-cyan-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ================= RIGHT PANEL ================= */}
            <div className={`${selectedChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col`}>

              {!selectedChat ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <Send className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">Select a conversation</p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="p-3 md:p-4 border-b flex justify-between items-center">
                    <div className="flex items-center gap-3">

                      {/* Mobile Back Button */}
                      <button
                        onClick={() => setSelectedChat(null)}
                        className="md:hidden text-gray-600"
                      >
                        ←
                      </button>

                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                        {activeChat?.avatar}
                      </div>

                      <div>
                        <h3 className="font-semibold text-sm md:text-base">
                          {activeChat?.name}
                        </h3>
                        <p className="text-xs text-gray-500">Active now</p>
                      </div>
                    </div>

                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 md:p-6 space-y-3 md:space-y-4">
                    {messages.map(msg => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] md:max-w-md px-3 md:px-4 py-2 rounded-lg text-sm ${
                            msg.isOwn
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          <p>{msg.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {msg.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="relative p-3 md:p-4 border-t flex gap-2 items-center"
                  >
                    <button
                      type="button"
                      onClick={() => setShowAttachments(prev => !prev)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Paperclip className="w-5 h-5 text-gray-600" />
                    </button>

                    {showAttachments && (
                      <div className="absolute bottom-16 left-3 md:left-4 bg-white border rounded-xl shadow-lg w-52 z-50">
                        {[
                          { label: 'Document', icon: FileText, type: 'document' },
                          { label: 'Photos & videos', icon: Image, type: 'media' },
                          { label: 'Camera', icon: Camera, type: 'camera' },
                          { label: 'Audio', icon: Headphones, type: 'audio' },
                        ].map(item => (
                          <button
                            key={item.label}
                            type="button"
                            onClick={() => openFilePicker(item.type)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100"
                          >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 px-3 md:px-4 py-2 border rounded-lg text-sm md:text-base"
                    />

                    <button className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg">
                      <Send className="w-5 h-5" />
                    </button>
                  </form>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;