// Define the shape of the bindings that will be available to our Worker
export interface Env {
	AI: any;
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		// We expect the frontend to make a POST request to this endpoint
		if (request.method !== 'POST') {
			return new Response('Expected POST request', { status: 405 });
		}

		try {
			// Read the user's message from the request body
			const body: { message: string } = await request.json();
			const userMessage = body.message;

			if (!userMessage) {
				return new Response('Missing message in request body', { status: 400 });
			}

			// This is the "brain" of our bot. It sets the persona and rules for the AI.
			const systemPrompt = `You are a Senior Principal Engineer at Cloudflare named the "Engineering Principles Bot." 
			Your audience is a new junior engineer. For every technical question you answer, your response MUST have two parts: 
			1. A clear, concise technical definition. 
			2. A separate paragraph titled "Engineering Principles:" that explains the concept in terms of Cloudflare's core engineering values: Performance, Reliability, Security, and Scale.`;

			const messages = [
				{ role: 'system', content: systemPrompt },
				{ role: 'user', content: userMessage },
			];

			// Call the Workers AI Llama-3 model using the AI binding
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
	},
};