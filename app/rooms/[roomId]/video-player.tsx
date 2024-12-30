"use client";

import React from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import './chat-styles.css';

const apiKey = process.env.NEXT_PUBLIC_GET_STREAM_API!;

export const PairVideo = ({ room }: { room: Room }) => {
  const { data: session} = useSession();
  const router = useRouter();

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
        isVideoInitialized.current = true;

        const callInstance = client.call('default', room.id);
        await callInstance.getOrCreate();
        await callInstance.join();
        setCall(callInstance);
      } catch (error) {
        console.error('Video initialization error:', error);
      }
    };

    initializeVideo();
    
  }, [room, session, chatClient]);

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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-blue-900">
      {!videoClientRef.current || !chatClient || !call || !channel ? (
        <div className="flex items-center justify-center h-screen">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-gold-400 animate-spin"></div>
            <div className="absolute inset-0 rounded-full border-r-4 border-l-4 border-navy-600 animate-spin animation-delay-150"></div>
            <div className="absolute inset-0 rounded-full border-t-4 border-b-4 border-gray-300 animate-spin animation-delay-300"></div>
          </div>
        </div>
      ) : (
        <Card className="flex-grow m-4 overflow-hidden bg-navy-800/90 backdrop-blur-sm border-navy-700 shadow-xl">
          <CardContent className="p-0 h-full">
            <div className="flex flex-col h-full">
              {/* Video Section */}
              <div className="flex-grow bg-gradient-to-r from-navy-900 to-navy-800 p-4 rounded-t-lg">
                {videoClientRef.current && call ? (
                  <StreamVideo client={videoClientRef.current}>
                    <StreamTheme>
                      <StreamCall call={call}>
                        <SpeakerLayout />
                        <CallControls />
                      </StreamCall>
                    </StreamTheme>
                  </StreamVideo>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <p>Video is not available. Please check your connection.</p>
                  </div>
                )}
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col md:flex-row h-1/3 mt-4 space-y-4 md:space-y-0 md:space-x-4 p-4">
                {/* Participants List */}
                <Card className="flex-1 bg-navy-700 border-navy-600">
                  <CardHeader className="bg-navy-800 rounded-t-lg border-b border-navy-600">
                    <CardTitle className="text-gold-400 font-semibold">Participants</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-60px)]">
                    <ScrollArea className="h-full text-gray-200">
                      <CallParticipantsList onClose={() => undefined} />
                    </ScrollArea>
                  </CardContent>
                </Card>

                {/* Chat Section */}
                <Card className="flex-1 chat-container bg-navy-700 border-navy-600">
                  <CardHeader className="bg-navy-800 rounded-t-lg border-b border-navy-600">
                    <CardTitle className="text-gold-400 font-semibold">Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-60px)]">
                    <Chat client={chatClient} theme="livestream dark">
                      <Channel channel={channel}>
                        <div className="flex flex-col h-full">
                          <ChannelHeader />
                          <div className="message-list">
                            <MessageList />
                          </div>
                          <div className="message-input-container">
                            <MessageInput />
                          </div>
                        </div>
                      </Channel>
                    </Chat>
                  </CardContent>
                </Card>
              </div>
              {/* Debug Information */}
              <div className="p-2 bg-navy-900 text-sm text-gray-400 rounded-b-lg">
                <p>Video Client Initialized: {videoClientRef.current ? 'Yes' : 'No'}</p>
                <p>Call Object Created: {call ? 'Yes' : 'No'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PairVideo;

