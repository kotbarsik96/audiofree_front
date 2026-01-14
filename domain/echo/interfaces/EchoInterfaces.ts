export type EchoInstance = ReturnType<typeof useEcho>

export type EchoPresenceChannel = ReturnType<EchoInstance['join']>
export type EchoPrivateChannel = ReturnType<EchoInstance['private']>
