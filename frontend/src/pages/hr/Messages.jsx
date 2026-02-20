import React, { useState, useEffect } from 'react';
import { Search, Send, MoreVertical } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    const res = await fetch("http://localhost:5000/api/messages/conversations");
    const data = await res.json();
    setConversations(data);
  };

  const fetchMessages = async (id) => {
    const res = await fetch(`http://localhost:5000/api/messages/conversation/${id}`);
    const data = await res.json();
    setMessages(data);
  };

  const handleSelectConversation = (id) => {
    setSelectedConversation(id);
    fetchMessages(id);
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;

    await fetch("http://localhost:5000/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversation_id: selectedConversation,
        message: messageInput
      })
    });

    setMessageInput('');
    fetchMessages(selectedConversation);
  };

  return (
    <div>
      <Sidebar />
      <div className="ml-64 min-h-screen bg-gray-50">
        <div className="p-6">

          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Communicate with candidates</p>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6" style={{ height: 'calc(100vh - 200px)' }}>
            <div className="flex h-full">

              {/* Conversations */}
              <div className="w-1/3 border-r border-gray-200 flex flex-col">

                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      className="w-full pl-10 pr-4 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {conversations.map(conv => (
                    <div
                      key={conv.id}
                      onClick={() => handleSelectConversation(conv.id)}
                      className="p-4 border-b cursor-pointer hover:bg-gray-50"
                    >
                      <h3 className="font-semibold text-gray-900">
                        {conv.candidate_name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.last_message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                  <>
                    <div className="p-4 border-b flex justify-between">
                      <h3 className="font-semibold">
                        {conversations.find(c => c.id === selectedConversation)?.candidate_name}
                      </h3>
                      <MoreVertical />
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'hr' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`px-4 py-2 rounded-lg max-w-xs ${
                            msg.sender === 'hr'
                              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                              : 'bg-gray-100'
                          }`}>
                            {msg.message}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 border-t flex space-x-2">
                      <input
                        type="text"
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border rounded-lg"
                      />
                      <button
                        onClick={handleSendMessage}
                        className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-semibold">Select a conversation</h3>
                      <p className="text-gray-600">Choose a candidate to start messaging</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Messages;
