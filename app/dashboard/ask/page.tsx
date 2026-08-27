import type { Metadata } from "next";
import AskChat from "./ask-chat";

export const metadata: Metadata = {
  title: "Ask ApnaSehat",
};

export default function AskPage() {
  return <AskChat />;
}
