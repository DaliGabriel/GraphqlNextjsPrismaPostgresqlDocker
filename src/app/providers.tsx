// app/providers.tsx (or lib/providers.tsx)
"use client";

import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client"; // Import your Apollo Client instance

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
