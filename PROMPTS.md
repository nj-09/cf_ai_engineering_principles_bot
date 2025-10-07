# AI Prompts Log for "Cloudflare Engineering Principles Bot"

This file documents the key prompts used with AI assistants during the research, design, and development of this project. It demonstrates the iterative process of using AI as a strategic partner and a productivity tool.

---

### **Phase 1: Initial Setup & Boilerplate Generation**

These prompts were used to establish the basic technical foundation of the Cloudflare Worker and frontend.

**1.1: Creating a Basic Echo Bot Backend**
> "I am in a Cloudflare Worker project using TypeScript. Here is the code for my `worker/src/index.ts` file. Please modify the `fetch` handler. It should now expect a POST request. It needs to read the incoming request's body as text, and then simply return that same text back in the response with the message 'You said: ' prepended to it. This is a simple echo bot."

**1.2: Researching the Modern Pages Functions Structure**
> "I am getting a '405 Method Not Allowed' error when trying to POST to my API route in a `wrangler pages dev` environment. The log says 'No Functions. Shimming...'. This suggests my `index.ts` file isn't being recognized. What is the modern, correct way to structure a project with a static frontend and a serverless backend function for a Cloudflare Pages deployment?"

---

### **Phase 2: Project Pivot & Conceptual Design**

After initial research, the project's theme was strategically pivoted to better align with Cloudflare's specific engineering culture.

**2.1: Initial "Mission-Aligned" Brainstorming**
> "I'm building an AI project for a Cloudflare internship. Instead of a generic chatbot, I want to create something that aligns with Cloudflare's core mission of 'building a better Internet.' The bot should explain technical concepts. How can I frame the AI's persona and responses to reflect Cloudflare's values like Performance, Security, and Reliability?"

**2.2: Refining the Concept to be "Engineering-First"**
> "The 'Better Internet Bot' idea feels a bit too much like an activist. How can I refine this concept to be more professional and focused on an internal engineering audience? The goal is to show I understand their technical culture, not just their public mission."

---

### **Phase 3: Core AI Logic - The System Prompt**

This was an iterative process to create the "brain" of the bot.

**3.1: First Draft of the System Prompt**
> "I am building the 'Cloudflare Engineering Principles Bot.' I need a system prompt for Llama-3. The AI's persona is a Senior Principal Engineer at Cloudflare. For every technical question it answers (e.g., 'What is a CDN?'), its response must have two parts: 1. A clear, concise technical definition. 2. A separate paragraph titled 'Engineering Principles' that explains the concept in terms of the core engineering trade-offs and values at Cloudflare: Performance, Reliability, Security, and Scale. Draft this system prompt for me."

**3.2: Final, Polished System Prompt (as used in `functions/api/chat.ts`)**
> `You are a Senior Principal Engineer at Cloudflare named the "Engineering Principles Bot." Your audience is a new junior engineer. For every technical question you answer, your response MUST have two parts: 1. A clear, concise technical definition. 2. A separate paragraph titled "Engineering Principles:" that explains the concept in terms of Cloudflare's core engineering values: Performance, Reliability, Security, and Scale.`

---

### **Phase 4: Implementing Conversational Memory**

**4.1: Adding KV Store Logic to the Backend**
> "I need to add conversational memory to my Cloudflare Pages Function using KV storage. The KV binding is named `CONVERSATION_HISTORY`. When a request comes in, the TypeScript handler should: 1. Get a unique session ID from the request body. 2. Use this ID to read the past conversation history from the KV store. 3. Append the new user message to the history. 4. Send the entire history to the Llama-3 model. 5. Append the AI's new response to the history. 6. Write the updated history back to the KV store with a 1-hour TTL. Please show me how to modify my code to do this."