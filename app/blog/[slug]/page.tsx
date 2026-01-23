import { getPostContent, getPostMetadata } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateStaticParams() {
    const posts = getPostMetadata();
    return posts.map((post) => ({
        slug: post.slug,
    }));
}

export default function PostPage({ params }: { params: { slug: string } }) {
    const { slug } = params;

    // Handle case where post might not exist (though generateStaticParams covers valid ones)
    let post;
    try {
        post = getPostContent(slug);
    } catch (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold">404 - Post Not Found</h1>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-background-dark text-white">
            <Navbar />

            <main className="flex-1 max-w-[800px] mx-auto w-full px-6 py-10">
                <article>
                    <div className="mb-10 text-center">
                        <div className="text-sm text-[#666] font-mono mb-2">
                            {post.metadata.date}
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-primary">
                            {post.metadata.title}
                        </h1>
                        <div className="w-20 h-1 bg-[#222] mx-auto rounded-full"></div>
                    </div>

                    <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-code:text-[#ff00ff]">
                        <MDXRemote source={post.content} />
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
