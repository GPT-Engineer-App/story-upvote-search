import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const fetchTopStories = async () => {
  const response = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const storyIds = await response.json();
  const stories = await Promise.all(
    storyIds.slice(0, 100).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`
      );
      return storyResponse.json();
    })
  );
  return stories;
};

const Index = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["topStories"],
    queryFn: fetchTopStories,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStories =
    data?.filter((story) =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Hacker News Top 100 Stories</h1>
      <Input
        type="text"
        placeholder="Search DSDSDSDSDSDSDSDSDS..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {isLoading ? (
        <Skeleton className="w-full h-8 mb-2" count={10} />
      ) : error ? (
        <p className="text-red-500">Error fetching stories</p>
      ) : (
        <ul className="space-y-4">
          {filteredStories.map((story) => (
            <li key={story.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{story.title}</h2>
              <p>{story.score} upvotes</p>
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Read more
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Index;
