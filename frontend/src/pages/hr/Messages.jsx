import { useState, useRef } from 'react';
import Sidebar from '../../components/common/Sidebar';

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

  const documentInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const cameraInputRef = useRef(null);

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

  const conversations = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      lastMessage: 'Thank you for considering my application',
      time: '2 hours ago',
      unread: 2,
      avatar: 'RK',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      lastMessage: 'I am available for the interview',
      time: '5 hours ago',
      unread: 0,
      avatar: 'PS',
    },
    {
      id: 3,
      name: 'Amit Patel',
      lastMessage: 'Could you provide more details about the role?',
      time: '1 day ago',
      unread: 1,
      avatar: 'AP',
    },
  ];

  const activeChat = conversations.find(c => c.id === selectedChat);

  const messages = selectedChat
    ? [
        {
          id: 1,
          text: `Hello! Thank you for applying.`,
          time: '10:30 AM',
          isOwn: false,
        },
        {
          id: 2,
          text: 'Thank you for reviewing my profile.',
          time: '10:35 AM',
          isOwn: true,
        },
        {
          id: 3,
          text: activeChat?.lastMessage,
          time: activeChat?.time,
          isOwn: false,
        },
      ]
    : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim()) return;
    setMessageText('');
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