import { useOutletContext } from "react-router-dom";

export default function LandingPage() {
  const { desktopView } = useOutletContext<{ desktopView?: boolean }>();
  // Add extra top margin for all views, but more for mobile
  return (
    <div className={desktopView ? "min-h-screen bg-background mt-8" : "min-h-screen bg-background mt-14 mb-2"}>
      {/* Landing page content here */}
    </div>
  );
} 