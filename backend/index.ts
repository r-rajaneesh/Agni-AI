import ollama, { type Message, type Ollama } from "ollama";
import helmet from "helmet";
import { cors } from "hono/cors";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import * as uuid from "uuid";
import { getCookie, setCookie } from "hono/cookie";
import moment from "moment";
import { Database } from "bun:sqlite";
import express from "express";
const app = new Hono();
app.use(cors());
app.use(prettyJSON());

// const db = new Database("./database/context.sqlite")
// db.query(`CREATE TABLE users (id INT PRIMARY KEY, session_id TEXT)`).run();
// db.query(`CREATE TABLE context (id TEXT, ctx BLOB, FORIEGN KEY (id) REFERENCES users(id))`).run();
// db.query(`CREATE TABLE history (id TEXT, messages BLOB, FORIEGN KEY (id) REFERENCES users(id))`).run();
const fetch_joke = async () => {
	const joke = await fetch("https://icanhazdadjoke.com/", {
		method: "GET",
		headers: {
			Acccept: "application/json",
		},
	});
	return joke.json();
};
const tools: { [x: string]: any } = {
	fetch_joke: fetch_joke,
};
const message_histories: {
	[x: string]: Message[];
} = {};
const chat_tools = [
	{
		type: "function",
		function: {
			name: "fetch_joke",
			description: "Fetches the jokes from https://iconhazdadjoke.com",
			parameters: {},
		},
	},
];
app.get("/", (c) => {
	return c.text("Hello World");
});
app.post("/chat", async (c) => {
	// setCookie();
	const body = await c.req.json();

	let session_id = getCookie(c, "session_id");
	if (!session_id) {
		const id = uuid.v7();
		setCookie(c, "session_id", id, { expires: moment().add("1d").toDate() });
		session_id = id;
	}
	if (!message_histories[session_id])
		message_histories[session_id] = [
			{
				role: "system",
				content: `You are a brutally honest yet constructive AI mentor named Agni, talking with Rajaneesh — a forward-thinking B.Tech IT student and programmer from Coimbatore, India; always help him grow as a developer, thinker, and problem solver; speak clearly, concisely, and logically — formal in technical or academic topics, comfortably informal when casual; always give direct, precise answers before explanations; be brutally honest without sugarcoating, then offer constructive fixes; use programming or computer science analogies when relevant; focus on clarity, truth, and efficiency; avoid filler, over-politeness, and repetition; never flatter or guess — respond based on fact, logic, and practical reasoning; ground opinions in technical or philosophical reasoning; never be passive — always guide Rajaneesh toward improvement and mastery; tone examples: when technical, “Your approach is functional but inefficient — optimize this by refactoring X”; when reflective, “That’s a solid idea, here’s how to sharpen it further”; when casual, “Yeah, that works — just clean up the logic so it doesn’t break under edge cases”; end goal: shape Rajaneesh into a high-caliber developer and thinker who values precision, logic, and truth over comfort or conformity.`,
			},
		];

	message_histories[session_id]?.push({
		role: "user",
		content: body["message"],
	});
	let response = await ollama.chat({
		model: "qwen3:1.7b",
		stream: false,
		think: false,
		tools: chat_tools,
		messages: message_histories[session_id],
	});
	console.log(JSON.stringify(response, null, 2));
	console.log(response.message.content);
	response.message.tool_calls?.forEach(async (toolcall) => {
		const toolop = (await tools[toolcall.function.name](toolcall.function.arguments)) as any;
		message_histories[session_id]?.push({
			role: "tool",
			tool_name: toolcall.function.name,
			content: toolop,
		});
		response = await ollama.chat({
			model: "qwen3:1.7b",
			stream: false,
			think: false,
			tools: chat_tools,
			messages: message_histories[session_id],
		});
	});
	message_histories[session_id]?.push(response.message);
	console.log(JSON.stringify(response, null, 2));
	console.log(response.message.content);
	return c.json(response.message);
});
Bun.serve({
	port: 3000,
	hostname: "0.0.0.0",
	fetch: app.fetch,
});
