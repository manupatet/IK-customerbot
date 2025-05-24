export interface Product {
  id: string;
  name: string;
  features: string;
  category: string;
  price: number;
  // Allows for any other properties, making the schema extensible
  [key: string]: any;
}

export interface User {
  email: string;
  // Password is not stored in the User object for security reasons.
  // It's only used during the authentication check.
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  confidence?: number; // Optional: for bot messages, indicating AI confidence
}

// Represents a single turn in a conversation, used for providing context to the AI
export interface ConversationTurn {
  role: 'user' | 'model'; // 'model' is often used for the AI/bot side
  content: string;
}
