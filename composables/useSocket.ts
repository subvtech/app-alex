import { io, type Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket() {
  if (!socket) {
    const config = useRuntimeConfig();
    socket = io(config.public.strapiUrl, {
      transports: ['websocket'],
    });
  }
  return socket;
}
