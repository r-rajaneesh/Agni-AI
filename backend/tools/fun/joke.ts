export default {
	type: "function",
	function: {
		name: "fetch_joke",
		description: "Fetches the jokes from https://iconhazdadjoke.com",
		parameters: {}, // Parameters are optional if there are none
	},
	execute: async () => {
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
	},
} as CTool;
