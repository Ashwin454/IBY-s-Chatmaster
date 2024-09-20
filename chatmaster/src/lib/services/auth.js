import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api/v1/' }),
  endpoints: (builder) => ({
    createUser: builder.mutation({
        query:(user)=>{
            // console.log("User: ",user);
            return{
                url:'register',
                method:'POST',
                body:user,
                header:{
                    'Content-Type':'multipart/form-data'
                },
                credentials: 'include'
            }
        }
    }),
    verifyEmail: builder.mutation({
        query:(user)=>{
            // .log(uconsoleser);
            return{
                url:'verify-email',
                method:'POST',
                body: user,
                headers: {
                    'Content-type':'application/json'
                }
            }
        }
    }),
    login: builder.mutation({
        query:(user)=>{
            // console.log(user);
            return{
                url:'login',
                method:'POST',
                body: user,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    forgotPass: builder.mutation({
        query:(user)=>{
            // console.log(user);
            return{
                url:'forgotPass',
                method:'POST',
                body: user,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    logout: builder.mutation({
        query:()=>{
            return{
                url:'logout/',
                method:'POST',
                body: {},
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    resetPass: builder.mutation({
        query:(data)=>{
            const {token, formData}=data;
            // console.log(token.token);
            // console.log(formData);
            return{
                url:`resetPass/${token.token}`,
                method:'POST',
                body: formData,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    loadProf: builder.query({
        query:()=>{
            return{
                url:`me`,
                method:'GET',
                credentials: 'include'
            }
        }
    }),
    searchUsers: builder.query({
        query: (search) => ({
            url: `users`,
            method: 'GET',
            params: { search },
            credentials: 'include',
        }),
    }),
    accessChat: builder.mutation({
        query: (data)=>{
            return{
                url:`chat/accessChat`,
                method:`POST`,
                body:data,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    myChats: builder.query({
        query: (data)=>{
            return{
                url:`chat/connectedChats`,
                methode:`GET`,
                credentials: `include`
            }
        }
    }),
    createGC: builder.mutation({
        query: (data)=>{
            return{
                url:`chat/createGC`,
                method:`POST`,
                body:data,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    renameGC: builder.mutation({
        query: (data)=>{
            return{
                url:`chat/renameGC`,
                method:`PUT`,
                body:data,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    addToGC: builder.mutation({
        query: (data)=>{
            return{
                url:`chat/addtoGC`,
                method:`PUT`,
                body:data,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    removeFromGC: builder.mutation({
        query: (data)=>{
            return{
                url:`chat/removefromGC`,
                method:`DELETE`,
                body:data,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    sendMessage: builder.mutation({
        query: (data)=>{
            return{
                url:`message/`,
                method:`POST`,
                body:data,
                headers: {
                    'Content-type':'application/json'
                },
                credentials: 'include'
            }
        }
    }),
    fetchMessage: builder.query({
        query: (data)=>{
            return{
                url:`message/${data.userId}`,
                method:`GET`,
                credentials: 'include'
            }
        }
    }),
  }),
})

export const { useCreateUserMutation, useVerifyEmailMutation, useLoginMutation, useForgotPassMutation, useLogoutMutation, useResetPassMutation, useLoadProfQuery, useSearchUsersQuery, useAccessChatMutation, useMyChatsQuery, useCreateGCMutation, useRenameGCMutation, useAddToGCMutation,useRemoveFromGCMutation, useSendMessageMutation, useFetchMessageQuery } = authApi