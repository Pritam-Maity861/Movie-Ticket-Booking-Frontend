import { tokenManager } from "../../lib/token-manager";

const AI_API_URL = import.meta.env.VITE_AI_API_URL || "http://localhost:8000/api";

export interface ChatHistoryItem {
  role: "user" | "assistant";
  content: string;
}

export interface GenerativeUIAction {
  type: "MOVIES_CAROUSEL" | "SHOWTIMES_LIST" | "SEAT_SELECTOR" | "BOOKING_HOLD" | "TICKET_CARD";
  data: any;
}

export interface ChatResponsePayload {
  response: string;
  session_id: string;
  generative_ui?: GenerativeUIAction | null;
}

/**
 * Sends a message to the CineMate AI service.
 */
export const sendChatMessageApi = async (
  message: string,
  history: ChatHistoryItem[] = [],
  sessionId: string = "default-session",
): Promise<ChatResponsePayload> => {
  const token = tokenManager.getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${AI_API_URL}/chat`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      session_id: sessionId,
      history,
      auth_token: token || undefined,
      stream: false,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `AI Service error: ${res.statusText}`);
  }

  return await res.json();
};

/**
 * Stream message from CineMate AI service using Server-Sent Events (SSE).
 */
export const streamChatMessageApi = async (
  message: string,
  history: ChatHistoryItem[],
  sessionId: string,
  onDelta: (text: string) => void,
  onGenerativeUI?: (ui: GenerativeUIAction) => void,
  onDone?: () => void,
  onError?: (err: any) => void,
) => {
  const token = tokenManager.getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${AI_API_URL}/chat?stream=true`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        message,
        session_id: sessionId,
        history,
        auth_token: token || undefined,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Failed to connect to AI stream (${response.status})`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const processBlock = (block: string) => {
      const trimmed = block.trim();
      if (!trimmed) return false;

      const eventMatch = trimmed.match(/^event:\s*(.+)$/m);
      const dataMatch = trimmed.match(/^data:\s*(.+)$/m);

      const eventType = eventMatch ? eventMatch[1].trim() : "chunk";
      const rawData = dataMatch ? dataMatch[1].trim() : "";

      if (eventType === "done" || rawData === "[DONE]") {
        if (onDone) onDone();
        return true;
      }

      try {
        const parsed = JSON.parse(rawData);
        if ((eventType === "chunk" || eventType === "message") && (parsed.delta || parsed.content)) {
          onDelta(parsed.delta || parsed.content);
        } else if (eventType === "generative_ui" && onGenerativeUI) {
          onGenerativeUI(parsed);
        } else if (eventType === "error" && onError) {
          onError(parsed.error);
        }
      } catch {
        if (rawData && (eventType === "chunk" || eventType === "message")) {
          onDelta(rawData);
        }
      }
      return false;
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        if (buffer.trim()) {
          processBlock(buffer);
        }
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() || "";

      for (const block of blocks) {
        const isDone = processBlock(block);
        if (isDone) return;
      }
    }

    if (onDone) onDone();
  } catch (err) {
    if (onError) onError(err);
  }
};

