import { useOutletContext } from "react-router-dom";

export default function LandingPage() {
  const { desktopView } = useOutletContext<{ desktopView?: boolean }>();
  return (
    <div className={desktopView ? "min-h-screen bg-background" : "min-h-screen bg-background mt-8 mb-2"}>
      {/* Landing page content here */}
    </div>
  );
} 