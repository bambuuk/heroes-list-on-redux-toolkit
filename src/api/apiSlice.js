import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // куди отримуємо дані (reducer)
  baseQuery: fetchBaseQuery({
    baseUrl: "https://640b3f4a65d3a01f981567a6.mockapi.io",
  }), // по якій адресі отримуємо дані
  tagTypes: ['Heroes'], // які мітки є в api
  endpoints: (builder) => ({
    // тут отримуємо дані
    getHeroes: builder.query({
      query: () => "/heroes",
      providesTags: ['Heroes'], // коли отримали дані, то показуємо до якої мітки відносяться дані
    }),
    // мутація даних
    createHero: builder.mutation({
      query: hero => ({
        url: '/heroes', // де буде відбуватись мутація
        method: 'POST',
        body: hero // тут автоматично дані перетворюються в json формат
      }),
      invalidatesTags: ['Heroes'] // мутація відбувається по даним тега Heroes
    }),
    deleteHero: builder.mutation({
      query: id => ({
        url: `/heroes/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Heroes']
    })
  }),
});

/*
  такі додавання міток дозволяють синхронізувати роботу з даними, коли наприклад іде запит
  на додаванння нових даних, то після нього ітиме запит GET для відображення актуальної
  інформації
*/

export const { useGetHeroesQuery, useCreateHeroMutation, useDeleteHeroMutation } = apiSlice;
