import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'
import Boards from './components/Boards';
import Settings from './components/Settings';
import Analytics from './components/Analytics';
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/dashboard' element={<Dashboard />}>
        <Route index element={<Boards />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path='*' element={<NotFound/>}/>
    </Routes>
  )
}

export default App
