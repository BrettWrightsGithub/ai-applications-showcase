import Link from "next/link";

const features = [
  {
    title: "Comparative Chat",
    description: "Compare responses from different AI models side by side",
    href: "/comparative-chat",
    icon: "💬",
  },
  {
    title: "RAG Demo",
    description: "Upload documents and ask questions about their contents",
    href: "/rag-demo",
    icon: "📚",
  },
  {
    title: "Researcher Agent",
    description: "Get summarized findings for your research topics",
    href: "/researcher-agent",
    icon: "🔍",
  },
  {
    title: "Scheduling Assistant",
    description: "Smart calendar management and scheduling recommendations",
    href: "/scheduling-assistant",
    icon: "📅",
  },
  {
    title: "Inspiration Finder",
    description: "Discover personalized inspirational quotes",
    href: "/inspiration-finder",
    icon: "✨",
  },
];

export default function Home() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            AI Applications Showcase
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Explore practical AI applications through interactive demonstrations
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative flex flex-col rounded-2xl border border-gray-200 p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-200"
              >
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <span className="text-3xl">{feature.icon}</span>
                  {feature.title}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </Link>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
