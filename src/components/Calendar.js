import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Calendar/index.css';
import { useDispatch } from 'react-redux';
import { fetchMeetings } from '../redux/MeetingApi';
import '../style/Calendar/index.css';

const Calendar = () => {
  const navigate = useNavigate();
  const [meetingList, setMeetingList] = useState([]);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(fetchMeetings())
      .unwrap()
      .then((data) => {
        const dates = data.map(meeting => meeting.date);
        setMeetingList(dates);
      })
      .catch((error) => {
        console.error('Error fetching meetings:', error);
      });    
  }, [dispatch]);

  const today = new Date();
  // const currentYear = today.getFullYear();
  // const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const daysInMonth = (year, month) => new Date(year, month, 0).getDate();
  const startDayOfMonth = (year, month) => {
    const startDay = new Date(year, month - 1, 1).getDay();
    return (startDay === 0 ? 6 : startDay - 1);
  };

  const onDateClick = (year, month, day) => {
    const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    navigate(`/date/${formattedDate}`)
  };

  const renderCalendar = (year, month) => {
    const days = [];
    const totalDays = daysInMonth(year, month);
    const startDay = startDayOfMonth(year, month);
    const lastDayOfPreviousMonth = daysInMonth(year, month - 1);
    const firstDayOfNextMonth = startDayOfMonth(year, month + 1);
    const weeks = [];
    let week = [];
  
    // Добавляем пустые ячейки для начала месяца
    for (let i = 0; i < startDay; i++) {
      const dayOfMonth = lastDayOfPreviousMonth - startDay + i + 1;
      const formattedDate = `${year}-${(month - 1).toString().padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')}`;
      week.push(
        <td key={`empty-${i}`} className={`date_type_empty ${meetingList.includes(formattedDate) && 'date_type_meeting'}`} onClick={() => onDateClick(year, month - 1, dayOfMonth)}>
          {dayOfMonth}
        </td>
      );
    }

    const nextMonthStartDay = (startDay + totalDays) % 7;
  
    // Добавляем дни текущего месяца
    for (let day = 1; day <= totalDays; day++) {
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      week.push(
        <td key={day} className={`day ${meetingList.includes(formattedDate) && 'date_type_meeting'}`} onClick={() => onDateClick(year, month, day)}>
          {day}
        </td>
      );

      if ((day + startDay) % 7 === 0 || day === totalDays) {
        days.push(week);
        if(day === totalDays) {
          for (let i = 0; i < (nextMonthStartDay === 0 ? 0 : 7 - nextMonthStartDay); i++) {
            const dayOfMonth = i + 1;
            const formattedDate = `${year}-${(month + 1).toString().padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')}`;
            week.push(
              <td key={`empty-next-${i} `} className={`date_type_empty ${meetingList.includes(formattedDate) && 'date_type_meeting'}`} onClick={() => onDateClick(year, month + 1, dayOfMonth)}>
                {dayOfMonth}
              </td>
            );
          }
        }
        week = [];
      }
    }

    // Добавляем недели в список
    days.forEach((week, index) => {
      weeks.push(<tr key={index}>{week}</tr>);
    });  
    return weeks;
  };

  // функция получения названия месяца по индексу
  const getMonthName = (monthIndex) => {
    const monthNames = [
      "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
      "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];
    return monthNames[monthIndex - 1];
  };

  
  const getMonthNameInCase = (monthIndex) => {
    const monthNames = [
      'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
      'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
    ];
    return monthNames[monthIndex - 1];
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((prevYear) => prevYear - 1);
      setCurrentMonth(12);
    } else {  
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if(currentMonth === 12) {
      setCurrentYear((prevYear) => prevYear + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className='calendar'>
      <div className='calendar__header'>
        <div className='calendar__switch-month'>
          <button className='calendar__button' onClick={handlePreviousMonth}>&#60;</button>
          <p className='calendar__month'>{`${getMonthName(currentMonth)}  ${currentYear}`}</p>
          <button className='calendar__button' onClick={handleNextMonth}>&#62;</button>
        </div>
        <p>{`${today.getDate()} ${getMonthNameInCase(today.getMonth() + 1)} ${today.getFullYear()}`}</p>
      </div>
      <table className="calendar__container">
        <thead className='calendar__head'>
          <tr className='calendar__row'>
            <th className='calendar__day'>Пн</th>
            <th className='calendar__day'>Вт</th>
            <th className='calendar__day'>Ср</th>
            <th className='calendar__day'>Чт</th>
            <th className='calendar__day'>Пт</th>
            <th className='calendar__day'>Сб</th>
            <th className='calendar__day'>Вс</th>
          </tr>
        </thead>
        <tbody className='calendar__body'>{renderCalendar(currentYear, currentMonth)}</tbody>
      </table>
    </div>
  );
};

export default Calendar;