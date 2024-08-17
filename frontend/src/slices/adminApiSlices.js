import { apiSlice } from "./apiSlice";

const ADMIN_URL = '/api/admin';

export const adminApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        adminLogin: builder.mutation({
            query: (data) => ({
                url: `${ADMIN_URL}/auth`,
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
        }),
        adminLogout: builder.mutation({
            query: () => ({
                url: `${ADMIN_URL}/logout`,
                method: 'POST',
                credentials: 'include',
            }),
        }),
        fetchUserData: builder.query({
            query: () => ({
                url: `${ADMIN_URL}/loadusers`,
                method: 'GET',
                credentials: 'include',
            }),
            providesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${ADMIN_URL}/users/${id}`,
                method: 'DELETE',
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        updateUserone: builder.mutation({ // Ensure the name matches
            query: ({ _id, ...data }) => ({
                url: `${ADMIN_URL}/users/${_id}`,
                method: 'PUT',
                body: data,
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
        createUser: builder.mutation({
            query: (newUser) => ({
                url: `${ADMIN_URL}/loadusers`,
                method: 'POST',
                body: newUser,
                credentials: 'include',
            }),
            invalidatesTags: ['User'],
        }),
    }),
});

export const { 
    useAdminLoginMutation, 
    useAdminLogoutMutation, 
    useFetchUserDataQuery, 
    useDeleteUserMutation, 
    useUpdateUseroneMutation, // Ensure the name matches
    useCreateUserMutation 
} = adminApiSlice;
