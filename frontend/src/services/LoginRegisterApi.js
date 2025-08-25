import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const LoginRegisterApi = createApi({
  reducerPath: "LoginRegisterApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api",
    credentials: "include"
   }),
  endpoints: (builder) => ({
    registerApi: builder.mutation({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }),
    }),
    duplicateUserIdCheckerApi: builder.mutation({
      query: (userId) => ({
        url: "/duplicateUserIdChecker",
        method: "POST",
        body: userId,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }),
    }),
    loginApi: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      }), 
    }),
    verifyRoute: builder.query({
      query: (userId) => ({
        url: `/dashboard/${userId}`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useRegisterApiMutation,
  useDuplicateUserIdCheckerApiMutation,
  useLoginApiMutation,
  useVerifyRouteQuery
} = LoginRegisterApi;
