import Drawer from "@/components/drawer/Drawer";
import MapContainer from "@/components/map/MapContainer";

export default function Home() {

  return (
    <div className="h-screen w-screen flex">
      <MapContainer />
      <Drawer/>
    </div>
  );
}
