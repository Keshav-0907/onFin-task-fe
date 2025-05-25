import Drawer from "@/components/drawer/Drawer";
import MapContainer from "@/components/map/MapContainer";
import ChatModal from "@/components/chat/ChatModal";
import React from "react";
import ChatDrawer from "@/components/chat/ChatDrawer";

export default function Home() {

  return (
    <div className="h-screen w-screen flex">
      <ChatDrawer/>
      <MapContainer />
      <Drawer />
      <ChatModal />
    </div>
  );
}
