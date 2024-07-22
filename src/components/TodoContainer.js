import React, {useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import boardsSlice from '../redux/boardsSlice';
import Header from './Header';
import Home from './Home';
import EmptyBoard from './EmptyBoard';

const TodoContainer = () => {
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards);
  const activeBoard = boards.find((board) => board.isActive);
  if (!activeBoard && boards.length > 0)
      dispatch(boardsSlice.actions.setBoardActive({ index: 0 }));
  
  return (
    <>
    {boards.length > 0 ?
        <>
        {/* <Header
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
        /> */}
        <Home
          setIsBoardModalOpen={setIsBoardModalOpen}
          isBoardModalOpen={isBoardModalOpen}
        />
        </>
        :
        <>
          <EmptyBoard type='add'/>
        </>
      }
    </>
  )
}

export default TodoContainer;