import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

 export const fetchUserById = createAsyncThunk(
  'users/fetchByIdStatus',
  async () => {
    console.log('http://localhost:3001/boards')
    const response = await axios.get(`http://localhost:3001/boards`)
    return response.data
  },
)

export const setTask = createAsyncThunk(
  'users/setTask',
  async (task) => {
    const {name, newColumns} = task
    await axios.post(`http://localhost:3001/boards`, {
      name: name,
      isActive: false,
      columns: newColumns
    }
    ).then(res => console.log(res))
    .catch(err => console.error(err))
  },
)

export const deleteBoard = createAsyncThunk(
  'users/deleteBoard',
  async (boardId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/boards/${boardId}`);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  },
);

export const editBoard = createAsyncThunk(
  'users/editBoard',
  async ({boardId, name, newColumns}, thunkAPI) => {
    try {
      const response = await axios.patch(`http://localhost:3001/boards/${boardId}`, {
        name: name,
        columns: newColumns
      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
)

export const addTask = createAsyncThunk(
  'users/addTask',
  async ({title, description, subtasks, status, boardId }, thunkAPI) => {
    // console.log(title, description, subtasks, status, columnId, boardId)
    try {
      const response = await axios.get(`http://localhost:3001/boards/${boardId}`);
      const board = response.data;
      
      const column = board.columns.find(col => col.name === status);
      console.log(column)
      if (!column) {
        throw new Error('Column not found');
      }
      
      column.tasks = [...column.tasks, {title, description, subtasks, status}];
      
      console.log(board.columns)
      
      const updateResponse = await axios.patch(`http://localhost:3001/boards/${boardId}`, {
        columns: [...board.columns]
      })

      return updateResponse.data;
    } catch (error) {
      console.error('Error updating board:', error);
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const dragTask = createAsyncThunk(
  'users/dragTask',
  async ({boardId, colIndex, prevColIndex, taskIndex }, thunkAPI) => {
    console.log(boardId, colIndex, prevColIndex, taskIndex)
    try {
      const response = await axios.patch(`http://localhost:3001/boards/${boardId}`, {

      })
      return response.data
    } catch (error) {
      console.error(error)
    }
  }
)
