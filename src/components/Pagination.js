import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import { fetchUsersPagination } from '../redux/UsersApi';

const Pagination = ({totalItems, itemPerPage, limit, setData}) => {
  const totalPages = Math.ceil(totalItems / itemPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const pageList = []
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchUsersPagination({skip:currentPage, limit:limit})).then((action) => {
      if (action.payload) {
        setData({nodes: action.payload});

        console.log(action.payload)
      }
    });
  }, [currentPage]);


  for (let i = 1; i <= totalPages; i++) {
    pageList.push(i)
  }

  return (
    <div className='pl-[340px] pagination' style={{color: 'white'}}>
      <ul className='pagination__list'>
        {pageList.map((page, index) => (
          <li className='pagination__item' key={index}>
            <button onClick={() => setCurrentPage(page)}>{page}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Pagination