import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Newspaper } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <Newspaper className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-4xl font-bold">Hello World</CardTitle>
          <CardDescription className="text-lg mt-2">
            Welcome to News Aggregator
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Your personalized news aggregator is coming soon.
          </p>
          <Button size="lg" className="w-full">
            Get Started
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
