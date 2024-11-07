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
  const chatClientRef = useRef<StreamChat<DefaultGenerics> | null>(null);
  const videoClientRef = useRef<StreamVideoClient | null>(null);

  
  const isChatInitialized = useRef<boolean>(false);
  const isVideoInitialized = useRef<boolean>(false);

  useEffect(() => {
    if (!room || !session || isChatInitialized.current) return;

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
        isChatInitialized.current = true;

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
      if (isChatInitialized.current && chatClientRef.current) {
        chatClientRef.current.disconnectUser();
        isChatInitialized.current = false;
      }
    };
  }, [room, session]);

  useEffect(() => {
    if (!room || !session || !chatClient || isVideoInitialized.current) return;


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

        videoClientRef.current = client;
        setVideoClient(client);
        isVideoInitialized.current = true;
  

        const call = client.call('default', room.id);
         call.join();
        setCall(call);
      } catch (error) {
        console.error('Video initialization error:', error);
      }
    };

    initializeVideo();
    return () => {
      if (isVideoInitialized.current && videoClientRef.current) {
        videoClientRef.current.disconnectUser();
        isVideoInitialized.current = false;
      }
    };
  }, [chatClient, session, videoClientRef]);

  useEffect(() => {
    return () => {
      if (isChatInitialized.current && chatClientRef.current) {
        chatClientRef.current.disconnectUser();
        isChatInitialized.current = false;
      }
      if (isVideoInitialized.current && videoClientRef.current) {
        videoClientRef.current.disconnectUser();
        isVideoInitialized.current = false;
      }
    };
  }, []);

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
        <div className="flex flex-col h-full text-black bg-white shadow-lg rounded-t-lg">
        <ChannelHeader/>
        <div className="flex flex-col overflow-y-auto p-4">
          <MessageList/>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-700y- dark:bg-gray-200">
          <MessageInput />
        </div>
        </div>
      </Channel>
      </Chat>
    </div>
    
  );
};