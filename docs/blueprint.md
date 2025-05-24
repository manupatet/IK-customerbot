# **App Name**: ProductAssist

## Core Features:

- Product Catalog Initialization: Loads a list of products with attributes such as name and features from a local JSON file into memory. The schema should be easily extensible to other product attributes without code changes.
- AI-Powered Customer Chat: Uses a suitable LLM with LangChain to generate informative and helpful responses to customer inquiries. If necessary, this feature incorporates an embeddings-based product lookup tool to find the right products from the catalog, and inform the response. The response indicates how certain the tool is about which piece of product information is helpful
- Web Chat Interface: Provides a web-based chat interface where customers can type questions and receive responses from the support bot.
- User Authentication: Enables users to create accounts using a simple email/password combination, storing user credentials locally to support personalized sessions.
- Contextual Chat Memory: Maintains per-user session memory using LangChain’s memory module, ensuring context is preserved across multiple chat turns, as appropriate for the specific questions the user is asking. Uses conversation summarization and question contextualization for a better chat experience.

## Style Guidelines:

- Primary color: A muted blue (#778899) to give a calm and trustworthy feel, referencing the cool neutrality of ash tones. A familiar, comfortable tone, useful in guiding an inexperienced user.
- Background color: A very light, desaturated blue (#F0F8FF) creates a clean backdrop that doesn't distract from the content.
- Accent color: A soft lavender (#E6E6FA) to highlight interactive elements.
- Clean, sans-serif fonts optimized for readability on screen to ensure easy information processing.
- Simple, minimalist icons for key actions to guide users intuitively.
- A clean, card-based design for organizing product information.
- Subtle transition animations and loading indicators provide feedback without being intrusive.