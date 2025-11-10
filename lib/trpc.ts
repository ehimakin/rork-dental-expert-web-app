import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('Using API Base URL:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  console.error('EXPO_PUBLIC_RORK_API_BASE_URL is not set. Backend requests will fail.');
  return 'http://localhost:3000';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      fetch: (url, options) => {
        console.log('🔵 Making tRPC request to:', url);
        return fetch(url, {
          ...options,
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
          },
        }).then(response => {
          console.log('🟢 tRPC response status:', response.status);
          if (!response.ok) {
            console.error('❌ tRPC request failed:', response.statusText);
          }
          return response;
        }).catch(error => {
          console.error('❌ tRPC fetch error:', error);
          throw error;
        });
      },
    }),
  ],
});
