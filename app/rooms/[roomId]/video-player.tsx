"use client"

import { Room } from '@/db/schema';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import {
    Call,
    CallControls,
    SpeakerLayout,
    StreamCall,
    StreamTheme,
    StreamVideo,
    StreamVideoClient,
    User,
  } from '@stream-io/video-react-sdk';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { generateToken } from './actions';
  
  const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API!;
  const userId = 'user-id';
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiZDJhNTc1MTYtYmEwZS00ZGFkLTgxZmYtYjRiMGY0N2I4Nzc1In0.OoHnkMDhA8ErIqtr6N-CB7Q7oc7C1Ijv44J8rO8auDg';
  const user: User = { id: userId };
  
  export const PairVideo = ({room}: {room: Room}) => {
    const session = useSession();
    const [client, setClient] = useState<StreamVideoClient | null>(null);
    const [call, setCall] =  useState<Call | null>(null);
    useEffect(()=>{
        if(!room) return;
        if(!session.data){
            return;
        }
        const userId = session.data?.user.id;
        const client = new StreamVideoClient({ apiKey, user: {
            id: userId
        },
        tokenProvider: () => generateToken(),
     });
        setClient(client);
        const call = client.call('default', 'my-first-call');
        call.join({ create: true });
        setCall(call);

        return () => {
            call.leave();
            client.disconnectUser();
        };
        

    }, [session, room]);
    return client && call && (
      <StreamVideo client={client}>
        <StreamTheme>
        <StreamCall call={call}>
        <SpeakerLayout/>
        <CallControls/>
        </StreamCall>
        </StreamTheme>
      </StreamVideo>
    );
  };