import React, { useEffect, useState } from 'react'
import { CompactTable } from "@table-library/react-table-library/compact";
import { useSort } from "@table-library/react-table-library/sort";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchUsersPagination, fetchUsersSearch } from '../redux/UsersApi';
import { SortToggleType } from '@table-library/react-table-library/types';
import { ArrowsUpDownIcon } from '@heroicons/react/24/solid';
import { SortIconPositions } from '@table-library/react-table-library/types';
import { ArrowSmallDownIcon } from '@heroicons/react/24/solid';
import { ArrowSmallUpIcon } from '@heroicons/react/24/solid';
import Sidebar from './Sidebar';
import Pagination from './Pagination';

const UsersContainer = () => {
  const [users, setUsers] = useState({nodes: []});
  const [totalItems, setTotalItems] = useState(0);
  const [searchParams, setSearchParams] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers()).then((action) => {
      if (action.payload) {
       setTotalItems(action.payload.length)
      }
    });
  }, [dispatch]);
  
  const theme = useTheme(getTheme());

  const sort = useSort(
    users,
    {
      onChange: onSortChange,
    },
    {
      sortIcon: {
        iconDefault: <ArrowsUpDownIcon color='#000'/>,
        iconUp: <ArrowSmallDownIcon color='#000'/>,
        iconDown: <ArrowSmallUpIcon color='#000'/>,
      },

      sortToggleType: SortToggleType.AlternateWithReset,

      sortFns: {
        NAME: (array) => array.sort((a, b) => a.name.localeCompare(b.name)),
        SURNAME: (array) => array.sort((a, b) => a.surname.localeCompare(b.surname)),
        LAST_NAME: (array) => array.sort((a, b) => a.lastName.localeCompare(b.lastName)),
        EMAIL: (array) => array.sort((a, b) => a.email.localeCompare(b.email)),
      },
    }
  );

  function onSortChange(action, state) {
    console.log(action, state);
  }

  const COLUMNS = [
    { label: "id", renderCell: (item) => item.id},
    { label: "Фамилия", renderCell: (item) => item.lastName, sort: { sortKey: "LAST_NAME"} },
    { label: "Имя", renderCell: (item) => item.name,sort: { sortKey: "NAME"} },
    { label: "Отчество", renderCell: (item) => item.surname, sort: { sortKey: "SURNAME"} },
    { label: "Телефон", renderCell: (item) => item.phone },
    { label: "E-mail", renderCell: (item) => item.email, sort: { sortKey: "EMAIL"}},

  ]
  
  const searchUsers = () => {
    dispatch(fetchUsersSearch(searchParams)).then((action) => {
      if (action.payload) {
        setUsers({nodes: action.payload})
      }
    })
    setIsSearch(true)
  }
  
  useEffect(() => {
    if (searchParams.length === 0) {
      dispatch(fetchUsersPagination({skip: 1, limit: 5})).then((action) => {
        if (action.payload) {
          setUsers({nodes: action.payload})
        }
      })
      setIsSearch(false)
    }
  }, [searchParams])

  return (
    <section className='users'>

      <div className='users__search '>
        <label className='users__search-label' > Поиск пользователя
          <input className='users__search-input' name='search' onChange={(e) => setSearchParams(e.target.value)} type="text" placeholder='Поиск' />
        </label>
        <button onClick={searchUsers}>Поиск</button>
      </div>
      <div className='users__table'>
        {users.nodes.length > 0 && <CompactTable columns={COLUMNS} data={users} theme={theme} sort={sort} />}
      </div>
      {!isSearch && <Pagination totalItems={totalItems} itemPerPage={5} limit={5} setData={setUsers} />}
    </section>

  )
}

export default UsersContainer;