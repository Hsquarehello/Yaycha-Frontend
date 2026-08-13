import { useEffect, useRef } from "react";
import useWebSocketModule, { ReadyState } from "react-use-websocket";
import { useApp, queryClient } from "./ThemedApp";
import type { JSX } from "react";

const useWebSocket =
  typeof useWebSocketModule === "function"
    ? useWebSocketModule
    : (useWebSocketModule as any).default || useWebSocketModule;

// 1. WebSocket ကနေ ရောက်လာမယ့် Message ရဲ့ Structure/Type ကို သတ်မှတ်ပါ
interface ServerWSMessage {
  type?: string;
  message?: string;
  event?: string | string[]; // queryClient.invalidateQueries အတွက် string သို့မဟုတ် Query Key array
  [key: string]: unknown; // အခြား ပို့လိုက်နိုင်သော Data များအတွက်
}

export default function AppSocket(): JSX.Element {
  const { auth } = useApp();
  const tokenSentRef = useRef<boolean>(false);

  // Env variable ကို string အဖြစ် Casting လုပ်ပါ
  const socketUrl =
    (import.meta.env.VITE_WS as string) || "ws://localhost:8000/subscribe";

  // 2. useWebSocket တွင် Generic Type ပေးပြီး Reconnect options များ ထည့်သွင်းပါ
  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      shouldReconnect: (closeEvent?: CloseEvent) => {
        const code = closeEvent?.code;
        if (code === 4001 || code === 4000) {
          console.warn(
            "WS: Authentication failed or bad request. Reconnect stopped.",
          );
          return false;
        }
        return true;
      }, // Connection ပြုတ်သွားပါက Auto Reconnect လုပ်ရန်
      reconnectInterval: 3000,
      // Connection ပိတ်သွားပါက Flag ကို reset ပြန်လုပ်မည်
      onClose: () => {
        tokenSentRef.current = false;
      },
    },
  );

  // 3. Authenticate Message ပို့ဆောင်ခြင်း
  useEffect(() => {
    if (auth && readyState === ReadyState.OPEN && !tokenSentRef.current) {
      const token = localStorage.getItem("token");

      if (token) {
        sendJsonMessage({ token });
        console.log("WS: Connection ready & token sent");
      } else {
        console.warn("WS: Auth is true but no token found in localStorage");
      }
    } else if (readyState !== ReadyState.OPEN) {
      tokenSentRef.current = false;
    }
  }, [auth, readyState, sendJsonMessage]);

  const typedLastJsonMessage = lastJsonMessage as ServerWSMessage | null;
  // 4. Message ရောက်လာပါက Cache Invalidate လုပ်ခြင်း
  useEffect(() => {
    if (typedLastJsonMessage) {
      console.log("WS: New message received", typedLastJsonMessage);

      if (typedLastJsonMessage.event) {
        // React Query / TanStack Query invalidateQueries ခေါ်ယူခြင်း
        queryClient.invalidateQueries({
          queryKey: Array.isArray(typedLastJsonMessage.event)
            ? typedLastJsonMessage.event
            : [typedLastJsonMessage.event],
        });
      }
    }
  }, [typedLastJsonMessage]);

  return <></>;
}
