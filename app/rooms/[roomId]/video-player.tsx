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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import './chat-styles.css'; // Added import

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
    <div className="flex flex-col h-screen bg-background">
      {!videoClientRef.current || !chatClient || !call || !channel ? (
        <div className="flex items-center justify-center h-screen">
          <Card className="w-64">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              </div>
              <p className="text-center mt-4">Loading...</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="flex-grow m-4 overflow-hidden">
          <CardContent className="p-0 h-full">
            <div className="grid grid-cols-3 gap-4 h-full">
              <div className="col-span-2 h-full">
                <StreamVideo client={videoClientRef.current}>
                  <StreamTheme>
                    <StreamCall call={call}>
                      <Card className="h-full">
                        <CardContent className="p-0 h-full flex flex-col">
                          <div className="flex-grow">
                            <SpeakerLayout />
                          </div>
                          <div className="p-2 bg-muted">
                            <CallControls
                              onLeave={() => {
                                router.push('/');
                              }}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </StreamCall>
                  </StreamTheme>
                </StreamVideo>
              </div>
              <div className="h-full flex flex-col">
                <Card className="flex-grow">
                  <CardHeader>
                    <CardTitle>Participants</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ScrollArea className="h-[200px]">
                      <CallParticipantsList onClose={() => undefined} />
                    </ScrollArea>
                  </CardContent>
                </Card>
                <Card className="mt-4 flex-grow">
                  <CardHeader>
                    <CardTitle>Chat</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 h-[calc(100%-4rem)]">
                    <Chat client={chatClient} theme="livestream">
                      <Channel channel={channel}>
                        <div className="flex flex-col h-full">
                          <ChannelHeader />
                          <ScrollArea className="flex-grow p-4">
                            <MessageList />
                          </ScrollArea>
                          <div className="p-4 border-t border-border">
                            <MessageInput />
                          </div>
                        </div>
                      </Channel>
                    </Chat>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

