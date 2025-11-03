import ollama, { type ChatResponse, type Message, type ChatRequest, type Tool } from "ollama";
import { cors } from "hono/cors";
import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import * as uuid from "uuid";
import { getCookie, setCookie } from "hono/cookie";
import moment from "moment";
import { globby, globbySync } from "globby";
import { Server as Engine } from "@socket.io/bun-engine";
import { Server } from "socket.io";
// import { Database } from "bun:sqlite";
import fs from "fs-extra";
import helmet from "helmet";
import chat from "./socket/chat.ts";

const io = new Server();

const engine = new Engine();

io.bind(engine);

const app = new Hono();

const { websocket } = engine.handler();
app.use(cors());
// app.use(helmet())
app.use(prettyJSON());
// const db = new Database("./database/context.sqlite")
// db.query(`CREATE TABLE users (id INT PRIMARY KEY, session_id TEXT)`).run();
// db.query(`CREATE TABLE context (id TEXT, ctx BLOB, FORIEGN KEY (id) REFERENCES users(id))`).run();
// db.query(`CREATE TABLE history (id TEXT, messages BLOB, FORIEGN KEY (id) REFERENCES users(id))`).run();

const message_history: {
	[x: string]: Message[];
} = {};
const tools: { [x: string]: any } = {};
const chat_tools: CTool[] = [];
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
	// console.log(tool_call_func);
	tools[`${tool_call_func?.function?.name}`] = tool_call_func?.execute;
});

// console.log(tools);
// Helper to load system prompt safely
let system_prompt = "You are a helpful assistant."; // Default fallback
try {
	system_prompt = fs.readFileSync("./systemprompt.md", "utf-8");
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
		// console.log(session_id);
		if (!session_id) {
			const id = uuid.v7();
			// Expires 1 day from now
			setCookie(c, "session_id", id, { expires: moment().add("1d").toDate(), httpOnly: true, path: "/" });
			session_id = id;
		}
		// console.log(session_id);

		const response = await chat({
			message: body["message"],
			chat_tools,
			message_history,
			session_id,
			system_prompt,
			tools,
		});
		return c.json(response);
	} catch (error) {
		console.error("Error in /chat endpoint:", error);
		return c.json({ success: false, error: (error as Error).message }, 500);
	}
});

io.on("connection", (socket) => {
	socket.on("chat:post", async (message) => {
		let session_id = "socket"; // remove hardcoding
		const response = await chat({ message, message_history, chat_tools, session_id, system_prompt, tools });
		socket.emit("chat:response", response);
	});
});

console.log("Starting server on http://0.0.0.0:3000");
Bun.serve({
	port: 3000,
	hostname: "0.0.0.0",
	idleTimeout: 30, // must be greater than the "pingInterval" option of the engine, which defaults to 25 seconds

	fetch(req, server) {
		const url = new URL(req.url);

		if (url.pathname === "/socket.io/") {
			return engine.handleRequest(req, server);
		} else {
			return app.fetch(req, server);
		}
	},

	websocket,
});
