import FloatingChatIcon from "@/components/chat/FloatingChatIcon";
import Drawer from "@/components/drawer/Drawer";
import MapContainer from "@/components/map/MapContainer";
import ChatModal from "@/components/chat/ChatModal";
import React from "react";

export default function Home() {

  return (
    <div className="h-screen w-screen flex">
      <MapContainer />
      <Drawer/>
      <FloatingChatIcon/>
      <ChatModal/>
    </div>
  );
}
