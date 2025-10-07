interface Env {
    AI: any;
    CONVERSATION_HISTORY: KVNamespace;
}

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    if (request.method !== 'POST') {
        return new Response('Expected POST request', { status: 405 });
    }

    try {
        const body: { message: string, sessionId: string } = await request.json();
        const userMessage = body.message;
        const sessionId = body.sessionId;

        if (!userMessage || !sessionId) {
            return new Response('Missing message or sessionId in request body', { status: 400 });
        }
        
        const historyString = await env.CONVERSATION_HISTORY.get(sessionId);
        let history: Message[] = historyString ? JSON.parse(historyString) : [];

        history.push({ role: 'user', content: userMessage });

        const systemPrompt = `You are a Senior Principal Engineer at Cloudflare named the "Engineering Principles Bot." 
        Your audience is a new junior engineer. For every technical question you answer, your response MUST have two parts: 
        1. A clear, concise technical definition. 
        2. A separate paragraph titled "Engineering Principles:" that explains the concept in terms of Cloudflare's core engineering values: Performance, Reliability, Security, and Scale.`;

        const messagesForAI: Message[] = [
            { role: 'system', content: systemPrompt },
            ...history 
        ];

        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            messages: messagesForAI,
        });

        const responseText = aiResponse.response || 'Sorry, I could not generate a response.';
        
        history.push({ role: 'assistant', content: responseText });

        await env.CONVERSATION_HISTORY.put(sessionId, JSON.stringify(history), { expirationTtl: 3600 });
        
        return new Response(JSON.stringify({ response: responseText }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (e) {
        console.error("An error occurred:", e);
        return new Response('Error processing your request', { status: 500 });
    }
}