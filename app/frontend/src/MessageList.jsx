function toDataUrl(mediaMimeType, mediaData) {
  return `data:${mediaMimeType};base64,${mediaData}`;
}

function renderMessageBody(message) {
  const type = (message.type || "TEXT").toUpperCase();

  if (type === "IMAGE" && message.mediaData && message.mediaMimeType) {
    return (
      <img
        className="message-image"
        src={toDataUrl(message.mediaMimeType, message.mediaData)}
        alt="Shared message"
      />
    );
  }

  if (type === "VOICE" && message.mediaData && message.mediaMimeType) {
    return (
      <audio
        className="message-audio"
        controls
        src={toDataUrl(message.mediaMimeType, message.mediaData)}
      />
    );
  }

  return <span>{message.content}</span>;
}

function MessageList({ messages }) {
  return (
    <div className="messages">
      {messages.map((msg, i) => (
        <div key={msg.clientMessageId || i} className="message">
          <b>{msg.sender}:</b>
          <div className="message-content">{renderMessageBody(msg)}</div>
        </div>
      ))}
    </div>
  );
}

export default MessageList;