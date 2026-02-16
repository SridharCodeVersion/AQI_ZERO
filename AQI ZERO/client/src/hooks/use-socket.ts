import { useEffect, useState } from 'react';
import { getSocket } from '@/lib/socket';

export function useSocket<T>(eventType: string, initialState: T): T {
    const [data, setData] = useState<T>(initialState);

    useEffect(() => {
        const socket = getSocket();

        const handler = (payload: any) => {
            setData(payload);
        };

        socket.on(eventType, handler);

        return () => {
            socket.off(eventType, handler);
        };
    }, [eventType]);

    return data;
}
