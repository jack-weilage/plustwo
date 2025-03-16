import { Socket } from "node:net";

class TcpWebSocket extends Socket {
	constructor(private ws: WebSocket) {
		super();

		ws.addEventListener("message", (event: MessageEvent<ArrayBuffer>) => {
			this.push(Buffer.from(event.data));
		});
	}
	// TODO: does this require the callback?
	override write(str: unknown, encoding?: unknown, cb?: unknown): boolean {
		this.ws.send(str as string);

		return true;
	}
}

export async function authenticate(
	host: string,
	clientId: string,
	clientSecret: string,
): Promise<TcpWebSocket> {
	const response = await fetch(`https://${host}`, {
		headers: {
			// Authenticate with Cloudflare Access
			"CF-Access-Client-Id": clientId,
			"CF-Access-Client-Secret": clientSecret,
			// Upgrade to a websocket connection
			Connection: "Upgrade",
			Upgrade: "websocket",
		},
	});

	const websocket = (response as Response & { webSocket?: WebSocket & { accept(): void } })
		.webSocket;

	if (!websocket) {
		throw new Error("Failed to upgrade initial connection to websocket");
	}

	const socket = new TcpWebSocket(websocket);
	websocket.accept();

	return socket;
}
