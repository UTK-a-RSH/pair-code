"use client";

import { Room } from '@/db/schema';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import {
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  StreamVideoClient,
  CallControls,
  CallParticipantsList,
  Call,
} from '@stream-io/video-react-sdk';
import { useSession } from 'next-auth/react';
import { useEffect, useState, useRef } from 'react';
import { generateToken } from './actions';
import { useRouter } from 'next/navigation';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageList,
  MessageInput,
} from 'stream-chat-react';
import { StreamChat, Channel as StreamChannel, DefaultGenerics } from 'stream-chat';

const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API!;

export const PairVideo = ({ room }: { room: Room }) => {
  const { data: session} = useSession();
  const router = useRouter();

  
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [channel, setChannel] = useState<StreamChannel<DefaultGenerics> | undefined>(undefined);
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const chatClientRef = useRef<StreamChat | null>(null);

  
  

  useEffect(() => {
    if (!room || !session) return;

    const initializeChat = async () => {
      try {
        const client = StreamChat.getInstance(apiKey);
        const token = await generateToken();

        await client.connectUser(
          {
            id: session.user.id,
            name: session.user.name ?? '',
            image: session.user.image ?? '',
          },
          token
        );

        chatClientRef.current = client;
        setChatClient(client);

        const channel = client.channel('livestream', room.id, {
          name: room.name,
        });
        await channel.watch();
        setChannel(channel);
      } catch (error) {
        console.error('Chat initialization error:', error);
      }
    };

    initializeChat();

    return () => {
      chatClientRef.current?.disconnectUser();
    };
  }, [room, session]);

  useEffect(() => {
    if (!chatClient) return;

    const initializeVideo = async () => {
      try {
        if (!session) return;

        const client = new StreamVideoClient(apiKey);
        await client.connectUser(
          {
            id: session.user.id,
            name: session.user.name ?? '',
            image: session.user.image ?? '',
          },
          await generateToken()
        );
        setVideoClient(client);

        const call = client.call('default', room.id);
         call.join();
        setCall(call);
      } catch (error) {
        console.error('Video initialization error:', error);
      }
    };

    initializeVideo();
    return () => {
      videoClient?.disconnectUser();
    };
  }, [chatClient, room, session]);

  if (!videoClient || !chatClient || !call) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-100 ">
      <StreamVideo client={videoClient}>
      <StreamTheme>
        <StreamCall call={call}>
        <SpeakerLayout />
        <CallControls
          onLeave={() => {
          router.push('/');
          }}
        
        />
        <CallParticipantsList onClose={() => undefined}  />
        </StreamCall>
      </StreamTheme>
      </StreamVideo>
      <Chat client={chatClient} theme="livestream">
      <Channel channel={channel}>
        <div className="flex flex-col h-full bg-white shadow-lg rounded-t-lg">
        <ChannelHeader/>
        <div className="flex-1 overflow-y-auto p-4">
          <MessageList/>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <MessageInput />
        </div>
        </div>
      </Channel>
      </Chat>
    </div>
    
  );
};