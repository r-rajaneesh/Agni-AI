import ollama, { type ChatResponse, type Message, type ChatRequest, type Tool } from "ollama";
import { cors } from "hono/cors";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import * as uuid from "uuid";
import { getCookie, setCookie } from "hono/cookie";
import moment from "moment";
import { globby, globbySync } from "globby";
// import { Database } from "bun:sqlite";
import fs from "fs-extra";

const app = new Hono();
app.use(cors());
app.use(prettyJSON());

// const db = new Database("./database/context.sqlite")
// db.query(`CREATE TABLE users (id INT PRIMARY KEY, session_id TEXT)`).run();
// db.query(`CREATE TABLE context (id TEXT, ctx BLOB, FORIEGN KEY (id) REFERENCES users(id))`).run();
// db.query(`CREATE TABLE history (id TEXT, messages BLOB, FORIEGN KEY (id) REFERENCES users(id))`).run();

const fetch_joke = async () => {
	try {
		const jokeResponse = await fetch("https://icanhazdadjoke.com/", {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (!jokeResponse.ok) {
			console.error("Failed to fetch joke:", jokeResponse.statusText);
			return { error: "Failed to fetch joke", status: jokeResponse.status };
		}

		const jokeData = await jokeResponse.json();

		// console.log("JOKEE", jokeData);
		return jokeData;
	} catch (error) {
		console.error("Error in fetch_joke:", error);
		if (error instanceof SyntaxError) {
			return { error: "Failed to parse JSON response from joke API" };
		}
		return { error: "Unknown error fetching joke" };
	}
};

const tools: { [x: string]: any } = {
	// fetch_joke: fetch_joke,
};

const message_histories: {
	[x: string]: Message[];
} = {};

const tool_call_functions: CTool[] = [];

const chat_tools: CTool[] = [
	{
		type: "function",
		function: {
			name: "fetch_joke",
			description: "Fetches the jokes from https://iconhazdadjoke.com",
			parameters: {}, // Parameters are optional if there are none
		},
	},
];
await globbySync("./tools/**/*").forEach((toolPath) => {
	try {
		delete require.cache[require.resolve(toolPath)];
		delete import.meta.require.cache[import.meta.require.resolve(toolPath)];
		const { default: tool }: { default: CTool } = require(`${toolPath}`) as { default: CTool };
		chat_tools.push(tool);
	} catch (error) {
		console.log("There was some error deelting imported cache");
	}
});
chat_tools.forEach((tool_call_func) => {
	console.log(tool_call_func);
	tools[`${tool_call_func?.function?.name}`] = tool_call_func?.execute;
});
console.log(tools);
// Helper to load system prompt safely
let systemPrompt = "You are a helpful assistant."; // Default fallback
try {
	systemPrompt = fs.readFileSync("./systemprompt.md", "utf-8");
} catch (e) {
	console.warn("Warning: systemprompt.md not found. Using default prompt.");
}

app.get("/", (c) => {
	return c.text("Hello World");
});

app.post("/chat", async (c) => {
	try {
		const body = await c.req.json();

		let session_id = getCookie(c, "session_id");
		console.log(session_id);
		if (!session_id) {
			const id = uuid.v7();
			// Expires 1 day from now
			setCookie(c, "session_id", id, { expires: moment().add("1d").toDate(), httpOnly: true, path: "/" });
			session_id = id;
		}
		console.log(session_id);

		if (!message_histories[session_id]) {
			message_histories[session_id] = [
				{
					role: "system",
					content: systemPrompt,
				},
			];
		}

		message_histories[session_id]?.push({
			role: "user",
			content: body["message"],
		});

		let response: ChatResponse = await ollama.chat({
			model: "gpt-oss:120b-cloud",
			stream: false,
			think: false,
			tools: chat_tools,
			messages: message_histories[session_id],
		});
		console.log(JSON.stringify(response, null, 2));
		message_histories[session_id]?.push(response.message);
		while (response.message.tool_calls) {
			for (const toolcall of response.message.tool_calls) {
				console.log(`Executing tool: ${toolcall.function.name}`);

				const toolop = (await tools[toolcall.function.name](toolcall.function.arguments)) as any;

				message_histories[session_id]?.push({
					role: "tool",
					tool_name: toolcall.function.name,
					content: JSON.stringify(toolop),
				});

				response = await ollama.chat({
					model: "gpt-oss:120b-cloud",
					stream: false,
					think: false,
					tools: chat_tools,
					messages: message_histories[session_id],
				});

				message_histories[session_id]?.push(response.message);
			}
		}

		console.log(JSON.stringify(response, null, 2));
		console.log("Final content:", response.message.content);
		console.log(message_histories[session_id]);
		// Return the *final* message
		return c.json(response.message);
	} catch (error) {
		console.error("Error in /chat endpoint:", error);
		return c.json({ success: false, error: (error as Error).message }, 500);
	}
});

console.log("Starting server on http://0.0.0.0:3000");
Bun.serve({
	port: 3000,
	hostname: "0.0.0.0",
	fetch: app.fetch,
});
