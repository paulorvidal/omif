import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import type React from "react";

type TabsTriggerProps = {
  children: string;
  count?: number;
} & React.ComponentProps<typeof TabsTrigger>;

const formatCount = (count: number): string | number => {
  if (count > 999) {
    return "999+";
  }
  return count;
};

function AppTabs({ children, ...props }: React.ComponentProps<typeof Tabs>) {
  return (
    <Tabs className={cn("flex flex-col gap-4")} {...props}>
      {children}
    </Tabs>
  );
}

function AppTabsList({ ...props }: React.ComponentProps<typeof TabsList>) {
  return <TabsList {...props}></TabsList>;
}

function AppTabsTrigger({ children, count, ...props }: TabsTriggerProps) {
  return (
    <TabsTrigger {...props}>
      {children}
      {count && <Badge>{formatCount(count)}</Badge>}
    </TabsTrigger>
  );
}

function AppTabsContent({
  ...props
}: React.ComponentProps<typeof TabsContent>) {
  return <TabsContent className={cn("flex flex-col gap-4")} {...props} />;
}

export { AppTabs, AppTabsList, AppTabsTrigger, AppTabsContent };
