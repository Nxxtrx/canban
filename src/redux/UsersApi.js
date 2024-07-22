import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async () => {
    try {
      const response = await axios.get(`http://localhost:3001/users`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  },
)

export const fetchUsersPagination = createAsyncThunk(
  'users/fetchUsersPagination',
  async ({skip, limit}, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:3001/users?_start=${skip === 1 ? 0 : (skip -1) *limit}&_limit=${limit}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  },
)

export const fetchUsersSearch = createAsyncThunk(
  'users/fetchUsersSearch',
  async (searchParam, thunkAPI) => {
    try {
      const response = await axios.get(`http://localhost:3001/users?q=${searchParam}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  },
)

