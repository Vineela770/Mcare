import { useState, useEffect } from 'react';
import { Search, Send, MoreVertical, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import Sidebar from '../../components/common/Sidebar';

const Messages = () => {
  const { token, user } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // 📂 1. Fetch Conversations (Sidebar) - Pulls existing chats
  const fetchConversations = async () => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE}/api/candidate/conversations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const mappedConversations = data.conversations.map(c => ({
            ...c,
            hospital_name: c.hospital_name || c.full_name 
        }));
        setConversations(mappedConversations);
        // Auto-select first chat if none selected
        if (mappedConversations.length > 0 && !selectedChat) {
          setSelectedChat(mappedConversations[0].other_user_id);
        }
      }
    } catch (error) {
      console.error("❌ Chat List Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 📂 2. Fetch Chat History - Pulls messages between Manoj and selected contact
  const fetchMessages = async (chatId) => {
    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE}/api/candidate/messages/${chatId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setChatMessages(data.messages);
    } catch (error) {
      console.error("❌ Message Load Error:", error);
    }
  };

  // 🔍 3. Hospital Search Logic - Syncs with /contacts/search backend
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        try {
          // ✅ UPDATED: Changed from /search-hospitals to /contacts/search to match routes.js
          const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          const response = await fetch(`${API_BASE}/api/candidate/contacts/search?query=${searchQuery}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (data.success) setSearchResults(data.contacts); // data.contacts matches controller
        } catch (error) {
          console.error("❌ Search Error:", error);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, token]);

  useEffect(() => {
    if (token) fetchConversations();
  }, [token]);

  useEffect(() => {
    if (selectedChat) fetchMessages(selectedChat);
  }, [selectedChat]);

  // ➕ 4. Handle Send Message - Syncs with /messages POST backend
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedChat) return;

    try {
      const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const response = await fetch(`${API_BASE}/api/candidate/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          receiver_id: selectedChat, // Matches backend destructuring
          message_text: messageText
        })
      });

      const data = await response.json();
      if (data.success) {
        // Optimistically add message to UI
        setChatMessages((prev) => [...prev, data.message]);
        setMessageText('');
        // Refresh sidebar to update "last message" text
        fetchConversations();
      }
    } catch (error) {
      console.error("❌ Send Error:", error);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50 p-6 text-left">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Messages</h1>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            
            {/* LEFT: Conversations List & Search */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col relative">
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search hospitals (e.g. 'ap')..." 
                    className="w-full pl-10 pr-4 py-2 border rounded-lg outline-none focus:border-cyan-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  
                  {/* Search Results Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="absolute z-[999] w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-64 overflow-y-auto left-0 top-full">
                      {searchResults.map((hospital) => (
                        <div 
                          key={hospital.id}
                          className="p-3 hover:bg-cyan-50 cursor-pointer flex items-center space-x-3 transition-colors border-b last:border-0"
                          onClick={() => {
                            setSelectedChat(hospital.id);
                            setChatMessages([]); 
                            setSearchQuery('');
                            setSearchResults([]);
                            
                            const exists = conversations.some(c => c.other_user_id === hospital.id);
                            if (!exists) {
                              setConversations(prev => [
                                {
                                  other_user_id: hospital.id,
                                  hospital_name: hospital.full_name,
                                  message_text: 'Start chatting...'
                                },
                                ...prev
                              ]);
                            }
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-bold text-cyan-700">🏥</div>
                          <span className="font-medium text-gray-700">{hospital.full_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-cyan-500" /></div> : 
                 conversations.length > 0 ? (
                  conversations.map((chat) => (
                    <div key={chat.other_user_id} onClick={() => setSelectedChat(chat.other_user_id)} className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${selectedChat === chat.other_user_id ? 'bg-cyan-50' : ''}`}>
                      <div className="flex items-start space-x-3">
                        <div className="w-12 h-12 rounded-full bg-cyan-100 flex items-center justify-center text-xl shadow-inner">🏥</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate">{chat.hospital_name || 'Hospital HR'}</h3>
                          <p className="text-sm text-gray-500 truncate">{chat.message_text || 'No messages yet'}</p>
                        </div>
                      </div>
                    </div>
                  ))
                 ) : (
                   <div className="p-8 text-center text-gray-400 text-sm italic">Search for a hospital above to start a chat</div>
                 )}
              </div>
            </div>

            {/* RIGHT: Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50">
              <div className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {conversations.find(c => c.other_user_id === selectedChat)?.hospital_name?.[0] || 'H'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {conversations.find(c => c.other_user_id === selectedChat)?.hospital_name || 'Select a chat'}
                    </h3>
                    <p className="text-[10px] text-green-500 font-black uppercase tracking-wider">Online</p>
                  </div>
                </div>
                < MoreVertical className="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
                {!selectedChat ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">💬</div>
                    <p className="font-medium">Select a hospital from the list to start chatting</p>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-400 italic">No messages yet. Say hello!</div>
                ) : (
                  chatMessages.map((msg) => {
                    const isOwnMessage = msg.sender_id === user?.id;
                    return (
                      <div key={msg.id} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
                          isOwnMessage 
                            ? 'bg-cyan-600 text-white rounded-tr-none' 
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }`}>
                          <p className="text-sm leading-relaxed">{msg.message_text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    disabled={!selectedChat}
                    placeholder={selectedChat ? "Type your message..." : "Select a contact first"}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                  />
                  <button 
                    type="submit" 
                    disabled={!selectedChat || !messageText.trim()}
                    className="p-3 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all shadow-md active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;