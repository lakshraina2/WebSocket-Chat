package com._aml2b.demo_websocket.model;
public class Message {
    private String sender;
    private String content;
    private String type;
    private String mediaData;
    private String mediaMimeType;
    private String clientMessageId;
	public String getSender() {
		return sender;
	}
	public void setSender(String sender) {
		this.sender = sender;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getMediaData() {
		return mediaData;
	}
	public void setMediaData(String mediaData) {
		this.mediaData = mediaData;
	}
	public String getMediaMimeType() {
		return mediaMimeType;
	}
	public void setMediaMimeType(String mediaMimeType) {
		this.mediaMimeType = mediaMimeType;
	}
	public String getClientMessageId() {
		return clientMessageId;
	}
	public void setClientMessageId(String clientMessageId) {
		this.clientMessageId = clientMessageId;
	}    
}