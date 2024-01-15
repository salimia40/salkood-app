import { Message } from "db";
import { atom } from "jotai";

export const messagesAtoms = atom<Message[]>([]);
