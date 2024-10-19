import Styles from './Boards.module.css';
import FilterPage from './FilterPage';
import Header from './Header';
import TaskContainer from './TaskContainer';
export default function Boards() {
  return (
    <div className={Styles.boards_page}>
      <Header/>
      <FilterPage/>
      <TaskContainer/>
    </div>
  )
}
