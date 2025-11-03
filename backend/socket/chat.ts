import ollama, { type ChatResponse, type Message } from "ollama";

const chat = async ({
	message,
	message_history,
	chat_tools,
	system_prompt,
	tools,
	session_id,
}: {
	message: string;
	system_prompt: string;
	message_history: { [x: string]: Message[] };
	tools: { [x: string]: any };
	chat_tools: CTool[];
	session_id: string;
}) => {
	try {
		if (!message_history[session_id]) message_history[session_id] = [{ role: "system", content: system_prompt }];
		message_history[session_id].push({ role: "user", content: message });
		let response: ChatResponse = await ollama.chat({
			model: "gpt-oss:120b-cloud",
			stream: false,
			think: false,
			tools: chat_tools,
			messages: message_history[session_id],
		});
		// console.log(JSON.stringify(response, null, 2));
		message_history[session_id]?.push(response.message);
		while (response.message.tool_calls) {
			for (const toolcall of response.message.tool_calls) {
				// console.log(`Executing tool: ${toolcall.function.name}`);

				const toolop = (await tools[toolcall.function.name](toolcall.function.arguments)) as any;

				message_history[session_id]?.push({
					role: "tool",
					tool_name: toolcall.function.name,
					content: JSON.stringify(toolop),
				});

				response = await ollama.chat({
					model: "gpt-oss:120b-cloud",
					stream: false,
					think: false,
					tools: chat_tools,
					messages: message_history[session_id],
				});

				message_history[session_id]?.push(response.message);
			}
		}
		return response.message;
	} catch (error) {
		return { success: false, error: (error as Error).message };
	}
};
export default chat;
