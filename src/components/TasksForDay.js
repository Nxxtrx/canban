import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchMeetingsForDay, postNewMeeting } from '../redux/MeetingApi';

const TasksForDay = () => {
  const { date } = useParams();
  const dispatch = useDispatch();
  const [meetingList, setMeetingList] = useState([])

  useEffect(() => {
    if (date) {
      dispatch(fetchMeetingsForDay({ date }))
        .unwrap()
        .then((data) => {
          if (data.length > 0 && data[0].meetings) {
            const sortedMeetings = data[0].meetings.sort((a, b) => {
              const timeA = a.time.split(':');
              const timeB = b.time.split(':');
              const dateA = new Date(0, 0, 0, ...timeA);
              const dateB = new Date(0, 0, 0, ...timeB);
              return dateA - dateB;
            });
            setMeetingList(sortedMeetings)
          }
        })
        .catch((error) => {
          console.error('Error fetching meetings:', error);
        });
    }
    
  }, [dispatch, date]);

  const [value, setValue ] = useState({
    name: '',
    time: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValue(prevValue => ({
      ...prevValue,
      [name]: value
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.name && value.time) {
      const newMeeting = {
        name: value.name,
        time: value.time,
        isComplete: false
      };
      setMeetingList([...meetingList, newMeeting]);
      dispatch(postNewMeeting({ name: value.name, time: value.time, date: date,  }));
      setValue('');
    }
  }

  return (
    <section className='tasks-day m pl-[300px] pt-20'>
      <h1 style={{ color: "white", fontSize: "40px", textAlign: "center" }}>Запланированные встречи</h1>  
      <p style={{ color: "white", fontSize: "20px",marginBottom: "40px", textAlign: "center" }}>{date}</p>
      <ul style={{ color: "white", fontSize: "20px", marginLeft: "40px"}}>
        {meetingList.map((meeting, index) => (
          <li key={index} style={{display: "flex", gap: "10px", marginBottom: "10px"}}>
            <p>{meeting.time}</p>
            <p>{meeting.name}</p>
            <input type='checkbox' value={meeting.isCompleted} />
          </li>
        ))}
      </ul>
      <form style={{display: "flex", color: "white", gap: "10px", flexDirection: "column", marginLeft: "40px", maxWidth: "300px"}} onSubmit={handleSubmit}>
        <label> Название<br />
          <input style={{color: "black"}} type="text" placeholder='Название встречи' name='name' value={value.name || ''} onChange={handleChange}></input>
        </label>
        <label> Время<br />
          <input style={{color: "black"}} type="time" placeholder='Время' name='time' value={value.time || ''} onChange={handleChange}></input>
        </label>
        <button className='tasks-day__btn' style={{ backgroundColor: "white", color: "black", marginLeft: "40px", padding: "10px"}}>Добавить встречу</button>
      </form>
    </section>
  )
}

export default TasksForDay