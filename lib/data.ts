export interface Article {
  id: number;
  title: string;
  description: string;
  source: string;
  sourceColor: string;
  publishedAt: string;
  imageUrl?: string;
  url: string;
}

export const ARTICLES: Article[] = [
  {
    id: 1,
    title: "OpenAI Releases GPT-5 with Unprecedented Reasoning and Multimodal Capabilities",
    description:
      "The latest model from OpenAI demonstrates remarkable improvements in complex problem-solving, coding, and real-time visual reasoning — setting new benchmarks across every major AI evaluation suite.",
    source: "TechCrunch",
    sourceColor: "#0a8f5c",
    publishedAt: "2 hours ago",
    imageUrl: "https://picsum.photos/seed/ai1featured/600/400",
    url: "#",
  },
  {
    id: 2,
    title: "Federal Reserve Holds Interest Rates as Economy Shows Mixed Signals",
    description:
      "Fed chair signals a cautious approach as data points to conflicting trends in consumer spending and employment figures.",
    source: "BBC News",
    sourceColor: "#bb1919",
    publishedAt: "4 hours ago",
    imageUrl: "https://picsum.photos/seed/econ2news/600/400",
    url: "#",
  },
  {
    id: 3,
    title: "James Webb Telescope Discovers Habitable Exoplanet 40 Light-Years Away",
    description:
      "Scientists announce a super-Earth with conditions that could support liquid water, marking a breakthrough in the search for extraterrestrial life.",
    source: "BBC News",
    sourceColor: "#bb1919",
    publishedAt: "5 hours ago",
    imageUrl: "https://picsum.photos/seed/space3news/600/400",
    url: "#",
  },
  {
    id: 4,
    title: "Apple WWDC 2026: iOS 20 Redesign, M5 Ultra Mac Pro, and Vision Pro 2",
    description:
      "Apple's biggest WWDC in years brings sweeping changes across all platforms with a renewed focus on AI and spatial computing.",
    source: "The Verge",
    sourceColor: "#fa4b2e",
    publishedAt: "6 hours ago",
    imageUrl: "https://picsum.photos/seed/apple4news/600/400",
    url: "#",
  },
  {
    id: 5,
    title: "SpaceX Successfully Lands Starship on the Moon in Historic Mission",
    description:
      "A landmark moment for commercial spaceflight as SpaceX demonstrates lunar landing capability ahead of NASA's crewed Artemis missions.",
    source: "Reuters",
    sourceColor: "#ff8000",
    publishedAt: "8 hours ago",
    imageUrl: "https://picsum.photos/seed/space5news/600/400",
    url: "#",
  },
  {
    id: 6,
    title: "Global Chip Shortage Eases as TSMC Expands Arizona and Japan Facilities",
    description:
      "New TSMC facilities are expected to ease supply constraints by Q3 2026, with downstream effects on consumer electronics prices.",
    source: "BBC News",
    sourceColor: "#bb1919",
    publishedAt: "10 hours ago",
    url: "#",
  },
  {
    id: 7,
    title: "Harvard Study Links Ultra-Processed Foods to Accelerated Cognitive Decline",
    description:
      "Researchers found a strong correlation between diets high in ultra-processed foods and faster brain aging in adults over 50.",
    source: "The Guardian",
    sourceColor: "#1e5e72",
    publishedAt: "12 hours ago",
    imageUrl: "https://picsum.photos/seed/health7news/600/400",
    url: "#",
  },
  {
    id: 8,
    title: "Champions League Final: Real Madrid Clinches Record 16th Title in Comeback",
    description:
      "Vinicius Jr. scored the decisive goal in extra time as Real Madrid defeated Manchester City 3-2 at Allianz Arena.",
    source: "BBC News",
    sourceColor: "#bb1919",
    publishedAt: "1 day ago",
    imageUrl: "https://picsum.photos/seed/soccer8news/600/400",
    url: "#",
  },
  {
    id: 9,
    title: "EU Parliament Passes Landmark AI Regulation Act",
    description:
      "The sweeping AI Act requires transparency and safety standards for high-risk AI systems, setting a global regulatory precedent.",
    source: "Reuters",
    sourceColor: "#ff8000",
    publishedAt: "1 day ago",
    imageUrl: "https://picsum.photos/seed/eu9news/600/400",
    url: "#",
  },
  {
    id: 10,
    title: "Netflix Announces AI-Powered Personalization Engine for 2027",
    description:
      "The streaming giant's new recommendation system uses on-device AI to suggest content based on mood, time of day, and viewing patterns.",
    source: "The Verge",
    sourceColor: "#fa4b2e",
    publishedAt: "1 day ago",
    imageUrl: "https://picsum.photos/seed/netflix10news/600/400",
    url: "#",
  },
  {
    id: 11,
    title: "WHO Declares New Preventive Guidelines for Cardiovascular Disease",
    description:
      "Updated guidelines recommend earlier screening and lower thresholds for treatment, potentially affecting billions of people worldwide.",
    source: "The Guardian",
    sourceColor: "#1e5e72",
    publishedAt: "2 days ago",
    imageUrl: "https://picsum.photos/seed/health12news/600/400",
    url: "#",
  },
  {
    id: 12,
    title: "Tour de France 2026: Pogacar Takes Overall Lead After Mountain Stage",
    description:
      "Tadej Pogacar put in a dominant performance on Stage 15, distancing himself from rivals by nearly four minutes.",
    source: "BBC News",
    sourceColor: "#bb1919",
    publishedAt: "2 days ago",
    imageUrl: "https://picsum.photos/seed/cycling11news/600/400",
    url: "#",
  },
];
