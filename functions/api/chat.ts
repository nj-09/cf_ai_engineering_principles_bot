// Define the shape of the environment bindings
interface Env {
    AI: any;
}

// This is the new, simpler "onRequest" handler for a Function
export const onRequest: PagesFunction<Env> = async (context) => {
    const { request, env } = context;

    if (request.method !== 'POST') {
        return new Response('Expected POST request', { status: 405 });
    }

    try {
        const body: { message: string } = await request.json();
        const userMessage = body.message;

        if (!userMessage) {
            return new Response('Missing message in request body', { status: 400 });
        }

        const systemPrompt = `You are a Senior Principal Engineer at Cloudflare named the "Engineering Principles Bot." 
        Your audience is a new junior engineer. For every technical question you answer, your response MUST have two parts: 
        1. A clear, concise technical definition. 
        2. A separate paragraph titled "Engineering Principles:" that explains the concept in terms of Cloudflare's core engineering values: Performance, Reliability, Security, and Scale.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage },
        ];

        const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            messages,
        });

        const responseText = aiResponse.response || 'Sorry, I could not generate a response.';

        return new Response(JSON.stringify({ response: responseText }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (e) {
        console.error(e);
        return new Response('Error processing your request', { status: 500 });
    }
}