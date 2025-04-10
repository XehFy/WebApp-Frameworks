import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Profile {
  name: string;
  lastVisit: string;
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:3000',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getProfile: builder.query<Profile, void>({
      query: () => '/profile',
    }),
  }),
});

export const { useGetProfileQuery } = profileApi;