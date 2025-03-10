export type TwitchMessageType = "session_welcome";

export interface TwitchMessageMetadata {
	message_id: string;
	message_timestamp: string;
	message_type: TwitchMessageType;
}

export interface TwitchSessionWelcomeMessagePayload {
	session: TwitchSession;
}
export type TwitchMessagePayload = TwitchSessionWelcomeMessagePayload;

export interface TwitchMessage {
	metadata: TwitchMessageMetadata;
	payload: TwitchMessagePayload;
}

export interface TwitchSession {
	connected_at: string;
	id: string;
	keepalive_timeout_seconds: number;
	reconnect_url?: string;
	recovery_url?: string;
	status: "connected";
}
