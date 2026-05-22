export interface Article {
  id: number;
  title: string;
  description: string;
  source: string;
  sourceInitials: string;
  author: string;
  publishedAt: string;
  readTime: string;
  category: string;
  imageUrl: string;
  featured?: boolean;
  upvotes: number;
  url: string;
}

export interface TrendingTopic {
  id: number;
  name: string;
  articleCount: string;
  category: string;
}

export const CATEGORIES = [
  "All",
  "Technology",
  "Business",
  "Science",
  "Politics",
  "Sports",
  "Health",
  "Entertainment",
];

export const FEATURED_ARTICLE: Article = {
  id: 1,
  title: "OpenAI Releases GPT-5 with Unprecedented Reasoning and Multimodal Capabilities",
  description:
    "The latest model from OpenAI demonstrates remarkable improvements in complex problem-solving, coding, and real-time visual reasoning — setting new benchmarks across every major AI evaluation suite and reshaping what developers can build.",
  source: "TechCrunch",
  sourceInitials: "TC",
  author: "Sarah Chen",
  publishedAt: "2 hours ago",
  readTime: "5 min read",
  category: "Technology",
  imageUrl: "https://picsum.photos/seed/ai1featured/1200/600",
  featured: true,
  upvotes: 2847,
  url: "#",
};

export const ARTICLES: Article[] = [
  {
    id: 2,
    title: "Federal Reserve Holds Interest Rates as Economy Shows Mixed Signals",
    description:
      "Fed chair signals a cautious approach as data points to conflicting trends in consumer spending and employment figures.",
    source: "Bloomberg",
    sourceInitials: "BB",
    author: "Michael Torres",
    publishedAt: "4 hours ago",
    readTime: "3 min read",
    category: "Business",
    imageUrl: "https://picsum.photos/seed/econ2news/600/400",
    upvotes: 1203,
    url: "#",
  },
  {
    id: 3,
    title: "James Webb Telescope Discovers Habitable Exoplanet 40 Light-Years Away",
    description:
      "Scientists announce a super-Earth with conditions that could support liquid water, marking a breakthrough in the search for extraterrestrial life.",
    source: "Scientific American",
    sourceInitials: "SA",
    author: "Dr. Elena Vasquez",
    publishedAt: "5 hours ago",
    readTime: "6 min read",
    category: "Science",
    imageUrl: "https://picsum.photos/seed/space3news/600/400",
    upvotes: 3521,
    url: "#",
  },
  {
    id: 4,
    title: "Apple WWDC 2026: iOS 20 Redesign, M5 Ultra Mac Pro, and Vision Pro 2",
    description:
      "Apple's biggest WWDC in years brings sweeping changes across all platforms with a renewed focus on AI and spatial computing.",
    source: "The Verge",
    sourceInitials: "TV",
    author: "Dieter Bohn",
    publishedAt: "6 hours ago",
    readTime: "8 min read",
    category: "Technology",
    imageUrl: "https://picsum.photos/seed/apple4news/600/400",
    upvotes: 4102,
    url: "#",
  },
  {
    id: 5,
    title: "SpaceX Successfully Lands Starship on the Moon in Historic Mission",
    description:
      "A landmark moment for commercial spaceflight as SpaceX demonstrates lunar landing capability ahead of NASA's crewed Artemis missions.",
    source: "Reuters",
    sourceInitials: "RT",
    author: "James Williams",
    publishedAt: "8 hours ago",
    readTime: "4 min read",
    category: "Science",
    imageUrl: "https://picsum.photos/seed/space5news/600/400",
    upvotes: 8934,
    url: "#",
  },
  {
    id: 6,
    title: "Global Chip Shortage Eases as TSMC Expands Arizona and Japan Facilities",
    description:
      "New TSMC facilities are expected to ease supply constraints by Q3 2026, with downstream effects on consumer electronics prices.",
    source: "Wall Street Journal",
    sourceInitials: "WS",
    author: "Kevin Lin",
    publishedAt: "10 hours ago",
    readTime: "4 min read",
    category: "Business",
    imageUrl: "https://picsum.photos/seed/chip6news/600/400",
    upvotes: 892,
    url: "#",
  },
  {
    id: 7,
    title: "Harvard Study Links Ultra-Processed Foods to Accelerated Cognitive Decline",
    description:
      "Researchers found a strong correlation between diets high in ultra-processed foods and faster brain aging in adults over 50.",
    source: "Nature Medicine",
    sourceInitials: "NM",
    author: "Prof. Robert Kim",
    publishedAt: "12 hours ago",
    readTime: "5 min read",
    category: "Health",
    imageUrl: "https://picsum.photos/seed/health7news/600/400",
    upvotes: 2156,
    url: "#",
  },
  {
    id: 8,
    title: "Champions League Final: Real Madrid Clinches Record 16th Title in Comeback",
    description:
      "Vinicius Jr. scored the decisive goal in extra time as Real Madrid defeated Manchester City 3-2 at Allianz Arena.",
    source: "ESPN",
    sourceInitials: "ES",
    author: "Marco Silva",
    publishedAt: "1 day ago",
    readTime: "3 min read",
    category: "Sports",
    imageUrl: "https://picsum.photos/seed/soccer8news/600/400",
    upvotes: 6723,
    url: "#",
  },
  {
    id: 9,
    title: "EU Parliament Passes Landmark AI Regulation Act",
    description:
      "The sweeping AI Act requires transparency and safety standards for high-risk AI systems, setting a global regulatory precedent.",
    source: "Politico",
    sourceInitials: "PL",
    author: "Anna Mueller",
    publishedAt: "1 day ago",
    readTime: "7 min read",
    category: "Politics",
    imageUrl: "https://picsum.photos/seed/eu9news/600/400",
    upvotes: 1874,
    url: "#",
  },
  {
    id: 10,
    title: "Netflix Announces AI-Powered Personalization Engine for 2027",
    description:
      "The streaming giant's new recommendation system uses on-device AI to suggest content based on mood, time of day, and viewing patterns.",
    source: "Variety",
    sourceInitials: "VA",
    author: "Jessica Park",
    publishedAt: "1 day ago",
    readTime: "4 min read",
    category: "Entertainment",
    imageUrl: "https://picsum.photos/seed/netflix10news/600/400",
    upvotes: 1342,
    url: "#",
  },
  {
    id: 11,
    title: "Tour de France 2026: Pogacar Takes Overall Lead After Mountain Stage",
    description:
      "Tadej Pogacar put in a dominant performance on Stage 15, distancing himself from rivals by nearly four minutes.",
    source: "Cycling Weekly",
    sourceInitials: "CW",
    author: "Tom Pidcock",
    publishedAt: "2 days ago",
    readTime: "3 min read",
    category: "Sports",
    imageUrl: "https://picsum.photos/seed/cycling11news/600/400",
    upvotes: 987,
    url: "#",
  },
  {
    id: 12,
    title: "WHO Declares New Preventive Guidelines for Cardiovascular Disease",
    description:
      "Updated guidelines recommend earlier screening and lower thresholds for treatment, potentially affecting billions of people worldwide.",
    source: "The Lancet",
    sourceInitials: "LA",
    author: "Dr. Priya Sharma",
    publishedAt: "2 days ago",
    readTime: "6 min read",
    category: "Health",
    imageUrl: "https://picsum.photos/seed/health12news/600/400",
    upvotes: 1567,
    url: "#",
  },
];

export const TRENDING_TOPICS: TrendingTopic[] = [
  { id: 1, name: "Artificial Intelligence", articleCount: "2.4K articles", category: "Technology" },
  { id: 2, name: "Space Exploration", articleCount: "1.8K articles", category: "Science" },
  { id: 3, name: "Climate Change", articleCount: "3.1K articles", category: "Science" },
  { id: 4, name: "Cryptocurrency", articleCount: "987 articles", category: "Business" },
  { id: 5, name: "Gene Therapy", articleCount: "743 articles", category: "Health" },
  { id: 6, name: "US Elections 2028", articleCount: "5.2K articles", category: "Politics" },
  { id: 7, name: "Electric Vehicles", articleCount: "1.2K articles", category: "Business" },
];

export const QUICK_READS: Article[] = [
  {
    id: 13,
    title: "10 Productivity Hacks Backed by Neuroscience",
    description: "",
    source: "Fast Company",
    sourceInitials: "FC",
    author: "Lisa Park",
    publishedAt: "3 hours ago",
    readTime: "2 min",
    category: "Health",
    imageUrl: "https://picsum.photos/seed/prod13qr/80/80",
    upvotes: 445,
    url: "#",
  },
  {
    id: 14,
    title: "The Untold Story of How the Internet Was Built",
    description: "",
    source: "Wired",
    sourceInitials: "WI",
    author: "Tim Berners",
    publishedAt: "5 hours ago",
    readTime: "2 min",
    category: "Technology",
    imageUrl: "https://picsum.photos/seed/web14qr/80/80",
    upvotes: 312,
    url: "#",
  },
  {
    id: 15,
    title: "Why Sleep is the Ultimate Performance Enhancer",
    description: "",
    source: "Nature",
    sourceInitials: "NA",
    author: "Dr. Matthew Walker",
    publishedAt: "8 hours ago",
    readTime: "2 min",
    category: "Health",
    imageUrl: "https://picsum.photos/seed/sleep15qr/80/80",
    upvotes: 891,
    url: "#",
  },
];
