import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProjectShowcase from "@/components/ProjectShowcase";
import ToolsShowcase from "@/components/ToolsShowcase";
import LogStream from "@/components/LogStream";
import { getSortedPostsData } from "@/lib/posts";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden pixel-grid bg-background-dark">
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 max-w-[1200px] mx-auto w-full px-6 py-10">
        <Hero />

        <ProjectShowcase />

        <ToolsShowcase />

        <LogStream posts={allPostsData} />
      </main>

      <Footer />
    </div>
  );
}
