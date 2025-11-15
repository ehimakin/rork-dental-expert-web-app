import { createTRPCReact } from "@trpc/react-query";
import { httpLink } from "@trpc/client";
import type { AppRouter } from "@/backend/trpc/app-router";

export const trpc = createTRPCReact<AppRouter>();

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_RORK_API_BASE_URL) {
    console.log('✅ Using Rork API Base URL:', process.env.EXPO_PUBLIC_RORK_API_BASE_URL);
    return process.env.EXPO_PUBLIC_RORK_API_BASE_URL;
  }

  console.log('⚠️ EXPO_PUBLIC_RORK_API_BASE_URL not set');
  console.log('⚠️ Using empty base URL (same origin)');
  return '';
};

export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      fetch: async (url, options) => {
        console.log('🔵 Making tRPC request to:', url);
        console.log('🔵 Request method:', options?.method);
        console.log('🔵 Request headers:', options?.headers);
        
        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              ...options?.headers,
              'Content-Type': 'application/json',
            },
          });
          
          console.log('🟢 tRPC response status:', response.status);
          console.log('🟢 tRPC response headers:', response.headers);
          
          if (!response.ok) {
            const responseText = await response.clone().text();
            console.error('❌ tRPC request failed with status:', response.status);
            console.error('❌ Response text:', responseText.substring(0, 500));
          }
          
          return response;
        } catch (error) {
          console.error('❌ tRPC fetch error:', error);
          console.error('❌ Error details:', JSON.stringify(error, null, 2));
          throw error;
        }
      },
    }),
  ],
});
