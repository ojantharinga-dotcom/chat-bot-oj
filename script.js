/**
 * Gemini AI Chatbot - Frontend Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const chatBubble = document.getElementById('chat-bubble');
  const chatPopup = document.getElementById('chat-popup');
  const closeChatBtn = document.getElementById('close-chat-btn');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const chatMessages = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const typingIndicator = document.getElementById('typing-indicator');
  const chatWelcome = document.getElementById('chat-welcome');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  // Determine API base URL (handles both http://localhost:5000 and file:// preview)
  const isHttp = window.location.protocol.startsWith('http');
  const API_ENDPOINT = isHttp ? '/api/chat' : 'http://localhost:5000/api/chat';

  let isWaitingForResponse = false;

  // Format current time (e.g., 10:35 PM)
  function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // Toggle chat popup open/close
  function toggleChat(isOpen) {
    const shouldOpen = typeof isOpen === 'boolean' ? isOpen : !chatPopup.classList.contains('active');
    if (shouldOpen) {
      chatPopup.classList.add('active');
      chatBubble.classList.add('active');
      chatPopup.setAttribute('aria-hidden', 'false');
      setTimeout(() => chatInput.focus(), 150);
      scrollToBottom();
    } else {
      chatPopup.classList.remove('active');
      chatBubble.classList.remove('active');
      chatPopup.setAttribute('aria-hidden', 'true');
    }
  }

  // Auto-scroll messages to bottom
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Sanitize and simple markdown parsing for responses
  function formatBotMessage(text) {
    if (!text) return '';

    // Escape basic HTML to prevent XSS
    let escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```code```
    escaped = escaped.replace(/```([\s\S]*?)```/g, (match, code) => {
      return `<pre><code>${code.trim()}</code></pre>`;
    });

    // Inline code `code`
    escaped = escaped.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Bold text **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic text *text*
    escaped = escaped.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Bullet points (- or * at start of line)
    escaped = escaped.replace(/^\s*[-*]\s+(.*)$/gm, '• $1<br>');

    // Numbered lists (1. at start of line)
    escaped = escaped.replace(/^\s*(\d+)\.\s+(.*)$/gm, '$1. $2<br>');

    // Line breaks
    escaped = escaped.replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>');

    return escaped;
  }

  // Append a message to chat UI
  function appendMessage(sender, text, isError = false) {
    const row = document.createElement('div');
    row.className = `msg-row ${sender}`;

    const time = getCurrentTime();

    if (sender === 'bot') {
      row.innerHTML = `
        <div class="msg-avatar">OJ</div>
        <div class="msg-wrapper">
          <div class="bot-msg ${isError ? 'error-msg' : ''}">
            ${isError ? text : formatBotMessage(text)}
          </div>
          <span class="msg-time">${time}</span>
        </div>
      `;
    } else {
      // User message
      const sanitizedText = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');

      row.innerHTML = `
        <div class="msg-wrapper">
          <div class="user-msg">${sanitizedText}</div>
          <span class="msg-time">${time}</span>
        </div>
      `;
    }

    // Insert before typing indicator
    chatMessages.insertBefore(row, typingIndicator);
    scrollToBottom();
  }

  // Show / Hide Typing Indicator
  function showTyping(show) {
    if (show) {
      chatMessages.appendChild(typingIndicator);
      typingIndicator.classList.add('active');
    } else {
      typingIndicator.classList.remove('active');
    }
    scrollToBottom();
  }

  // Send message to server
  async function handleSendMessage(messageText) {
    const message = (messageText || chatInput.value).trim();
    if (!message || isWaitingForResponse) return;

    // Reset input
    chatInput.value = '';
    isWaitingForResponse = true;
    sendBtn.disabled = true;

    // Add user message to UI
    appendMessage('user', message);

    // Show typing dots
    showTyping(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      showTyping(false);

      if (!response.ok || data.error) {
        const errorMsg = data.error || `Error ${response.status}: Failed to get response.`;
        appendMessage('bot', errorMsg, true);
      } else {
        appendMessage('bot', data.reply);
      }
    } catch (error) {
      showTyping(false);
      console.error('Fetch error:', error);
      appendMessage(
        'bot',
        '⚠️ **සේවාදායකය (Server) සමඟ සම්බන්ධ විය නොහැක.**<br>කරුණාකර backend server එක ක්‍රියාත්මක කර ඇති බව තහවුරු කරගන්න (`npm start`).<br><small style="color: #64748b;">(Failed to connect to backend server at ' + API_ENDPOINT + ')</small>',
        true
      );
    } finally {
      isWaitingForResponse = false;
      sendBtn.disabled = false;
      chatInput.focus();
    }
  }

  // Event Listeners
  chatBubble.addEventListener('click', () => toggleChat());
  closeChatBtn.addEventListener('click', () => toggleChat(false));

  // Clear chat button
  clearChatBtn.addEventListener('click', () => {
    // Keep only welcome card and typing indicator
    chatMessages.innerHTML = '';
    if (chatWelcome) {
      chatMessages.appendChild(chatWelcome);
    }
    chatMessages.appendChild(typingIndicator);
    chatInput.focus();
  });

  // Send button click
  sendBtn.addEventListener('click', () => handleSendMessage());

  // Input Enter key press
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Suggestion chips click
  suggestionChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt');
      if (prompt) {
        handleSendMessage(prompt);
      }
    });
  });
});

