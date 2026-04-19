import { useEffect, useRef, useState } from "react";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function toBase64Payload(fileOrBlob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("Unable to encode media."));
        return;
      }

      const base64Data = reader.result.split(",")[1];
      resolve({
        base64Data,
        mimeType: fileOrBlob.type || "application/octet-stream",
      });
    };

    reader.onerror = () => reject(new Error("Unable to read media file."));
    reader.readAsDataURL(fileOrBlob);
  });
}

function toDataUrl(mimeType, base64Data) {
  return `data:${mimeType};base64,${base64Data}`;
}

function MessageInput({ sendTextMessage, sendImageMessage, sendVoiceMessage }) {
  const [text, setText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState(false);
  const [pendingImage, setPendingImage] = useState(null);
  const [pendingVoice, setPendingVoice] = useState(null);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state !== "inactive") {
        mediaRecorderRef.current?.stop();
      }

      mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleTextSend = () => {
    const wasSent = sendTextMessage(text);
    if (wasSent) {
      setText("");
    }
  };

  const handleImageSelected = async (event) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    if (!imageFile.type.startsWith("image/")) {
      alert("Please choose a valid image file.");
      event.target.value = "";
      return;
    }

    if (imageFile.size > MAX_IMAGE_SIZE_BYTES) {
      alert("Image is too large. Please select an image smaller than 5MB.");
      event.target.value = "";
      return;
    }

    try {
      const { base64Data, mimeType } = await toBase64Payload(imageFile);
      setPendingImage({
        base64Data,
        mimeType,
        fileName: imageFile.name,
      });
    } catch (error) {
      console.error(error);
      alert("Could not send image. Please try again.");
    } finally {
      event.target.value = "";
    }
  };

  const startRecording = async () => {
    if (typeof MediaRecorder === "undefined") {
      alert("This browser does not support voice recording.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      alert("This browser does not support voice recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const options = MediaRecorder.isTypeSupported("audio/webm")
        ? { mimeType: "audio/webm" }
        : undefined;
      const recorder = new MediaRecorder(stream, options);

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsProcessingVoice(true);

        const mimeType = recorder.mimeType || "audio/webm";
        const voiceNote = new Blob(audioChunksRef.current, { type: mimeType });

        audioChunksRef.current = [];
        mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;

        if (voiceNote.size === 0) {
          alert("No audio captured. Try recording for a little longer.");
          setIsProcessingVoice(false);
          return;
        }

        try {
          const { base64Data, mimeType: encodedMimeType } =
            await toBase64Payload(voiceNote);
          setPendingVoice({
            base64Data,
            mimeType: encodedMimeType,
          });
        } catch (error) {
          console.error(error);
          alert("Could not send voice note. Please try again.");
        } finally {
          setIsProcessingVoice(false);
        }
      };

      recorder.start(250);
      setIsRecording(true);
    } catch (error) {
      console.error(error);
      alert("Microphone access is required to record voice notes.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  const sendPendingImage = () => {
    if (!pendingImage) {
      return;
    }

    const wasSent = sendImageMessage(pendingImage.base64Data, pendingImage.mimeType);
    if (wasSent) {
      setPendingImage(null);
    }
  };

  const sendPendingVoice = () => {
    if (!pendingVoice) {
      return;
    }

    const wasSent = sendVoiceMessage(pendingVoice.base64Data, pendingVoice.mimeType);
    if (wasSent) {
      setPendingVoice(null);
    }
  };

  return (
    <>
      <div className="input-area">
        <input
          value={text}
          placeholder="Type message..."
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleTextSend();
            }
          }}
        />
        <button onClick={handleTextSend}>Send</button>
      </div>

      <div className="media-actions">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageSelected}
          className="hidden-file-input"
        />
        <button onClick={() => fileInputRef.current?.click()}>
          Send image
        </button>
        <button onClick={isRecording ? stopRecording : startRecording}>
          {isRecording ? "Stop recording" : "Record voice note"}
        </button>
      </div>

      {pendingImage && (
        <div className="pending-media">
          <div className="pending-title">Image ready: {pendingImage.fileName}</div>
          <img
            className="pending-image-preview"
            src={toDataUrl(pendingImage.mimeType, pendingImage.base64Data)}
            alt="Selected to send"
          />
          <div className="pending-actions">
            <button onClick={sendPendingImage}>Send selected image</button>
            <button onClick={() => setPendingImage(null)}>Discard image</button>
          </div>
        </div>
      )}

      {isProcessingVoice && (
        <div className="pending-info">Preparing voice note...</div>
      )}

      {pendingVoice && (
        <div className="pending-media">
          <div className="pending-title">Voice note ready</div>
          <audio
            className="pending-audio-preview"
            controls
            src={toDataUrl(pendingVoice.mimeType, pendingVoice.base64Data)}
          />
          <div className="pending-actions">
            <button onClick={sendPendingVoice}>Send voice note</button>
            <button onClick={() => setPendingVoice(null)}>Discard voice note</button>
          </div>
        </div>
      )}
    </>
  );
}

export default MessageInput;