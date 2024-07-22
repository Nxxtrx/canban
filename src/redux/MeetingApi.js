import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

 export const fetchMeetingsForDay = createAsyncThunk(
  'meetings/fetchMeetingsForDay',
  async ({date}, thunkAPI) => {
    try {   
      const response = await axios.get(`http://localhost:3001/meetings?date=${date}`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  },
)

export const fetchMeetings = createAsyncThunk(
  'meetings/fetchMeetings',
  async () => {
    try {   
      const response = await axios.get(`http://localhost:3001/meetings`)
      return response.data
    } catch (error) {
      console.log(error)
    }
  },
)

export const postNewMeeting = createAsyncThunk(
  'meetings/fetchMeetingsForDay',
  async ({name, time, date}, thunkAPI) => {
    try {   
      const responseToMeetings = await axios.get(`http://localhost:3001/meetings?date=${date}`);
      let meetingList;

      if(responseToMeetings.data.length === 0){
        meetingList = [];
      } else {
        meetingList = responseToMeetings.data[0].meetings;
      }

      if(meetingList.length > 0){
        console.log('второй элемент')
        const response = await axios.patch(`http://localhost:3001/meetings/${responseToMeetings.data[0].id}`, {
          meetings: [...meetingList, {name, time, isCompleted: false}]
        })
        return response.data
      } else {
        const response = await axios.post(`http://localhost:3001/meetings`, {
          date: date,
          meetings: [{name, time, isCompleted: false}]
        })
        return response.data
      }
    } catch (error) {
      console.log(error)
    }
  },
)