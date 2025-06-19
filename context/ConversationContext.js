// ConversationContext.js
import { createContext, useContext, useState } from "react";
import { INSTRUCTIONS } from "../constants/systemInstractions";

const ConversationContext = createContext();

export default function ConversationProvider({ children }) {
  const [history, setHistory] = useState([
    {
      role: "system",
      parts: [
        {
          text: INSTRUCTIONS,
        },
      ],
    },
  ]);

  return (
    <ConversationContext.Provider value={[history, setHistory]}>
      {children}
    </ConversationContext.Provider>
  );
}

export const useConversation = () => useContext(ConversationContext);
