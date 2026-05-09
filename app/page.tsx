import Header from "@/components/Header";
import DashboardClient from "@/components/DashboardClient";
import { getAllContent } from "@/lib/content";

export default function Home() {
  const allContent = getAllContent();

  return (
    <div className="min-h-screen">
      <Header />
      <DashboardClient allContent={allContent} />
    </div>
  );
}
