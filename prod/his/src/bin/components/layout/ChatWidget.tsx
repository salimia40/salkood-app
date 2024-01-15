"use client";
import {
  Affix,
  Popover,
  PopoverTarget,
  PopoverDropdown,
  Text,
  UnstyledButton,
  Card,
  NavLink,
  Stack,
  Group,
  ActionIcon,
} from "@mantine/core";
import { IconMessageCircle, IconX } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { getConversations } from "../../actions/conversation";
import { $Enums } from "db";
import NewMessageForm from "../NewMessageForm";
import ConversationForm from "../ConversationForm";
import { ConversationView } from "../ConversationView";

import classes from "./ChatWidget.module.css";

type Conversation = {
  messages: {
    id: string;
    userId: string;
    content: string;
    seen: boolean;
    createdAt: Date;
    updatedAt: Date;
    conversationId: string;
  }[];
} & {
  id: string;
  userId: string;
  status: $Enums.CoversationStatus;
  subject: string;
  createdAt: Date;
};

export default function ChatWidget() {
  const [opened, setOpened] = useState(false);

  const toggle = () => setOpened((o) => !o);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [currentConversation, setCurrentConversation] = useState<
    Conversation | undefined
  >(undefined);

  useEffect(() => {
    getConversations().then((res) => {
      if (res.success) {
        setConversations(res.data || []);
      }
    });
  });

  return (
    <Affix>
      <div
        style={{
          width: "100px",
          height: "100px",
          margin: "10px",
          padding: "10px",
        }}
        className={classes.cta}
      >
        <Popover
          width={350}
          position="top"
          withArrow
          closeOnEscape
          shadow="md"
          opened={opened}
          onChange={setOpened}
        >
          <PopoverTarget>
            <UnstyledButton
              style={{
                backgroundColor: "var(--mantine-color-blue-5)",
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "40px",
              }}
              className={classes.cta}
              onClick={toggle}
            >
              <IconMessageCircle size={"3em"} color="white" />
            </UnstyledButton>
          </PopoverTarget>
          <PopoverDropdown>
            <Card>
              <Card.Section>
                <Group justify="space-between">
                  <Text>
                    {currentConversation
                      ? currentConversation.subject
                      : "Select a conversation"}
                  </Text>
                  {currentConversation && (
                    <ActionIcon
                      variant="subtle"
                      color="red"
                      onClick={() => setCurrentConversation(undefined)}
                    >
                      <IconX size={"1em"} />
                    </ActionIcon>
                  )}
                </Group>
              </Card.Section>
              {currentConversation ? (
                <Card.Section h={500}>
                  <ConversationView
                    conversation={currentConversation}
                    height="100%"
                  />
                </Card.Section>
              ) : (
                <Card.Section h={300} style={{ overflow: "auto" }}>
                  {conversations.map((conversation) => (
                    <NavLink
                      key={conversation.id}
                      label={conversation.subject}
                      leftSection={<IconMessageCircle size={"1em"} />}
                      onClick={() => setCurrentConversation(conversation)}
                    ></NavLink>
                  ))}
                </Card.Section>
              )}
              {!currentConversation && (
                <ConversationForm
                  onNewConversation={(id) => {
                    getConversations().then((res) => {
                      if (res.success) {
                        setConversations(res.data || []);
                        setCurrentConversation(
                          res.data?.find((c) => c.id === id),
                        );
                      }
                    });
                  }}
                />
              )}
              <Card.Section>
                {currentConversation && (
                  <Stack>
                    <NewMessageForm conversationId={currentConversation.id} />
                  </Stack>
                )}
              </Card.Section>
            </Card>
          </PopoverDropdown>
        </Popover>
      </div>
    </Affix>
  );
}
