
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard'
import PeopleDirectory from './Pages/PeopleDirectory';
import './App.css'


function App() {


  return (
    <>
  <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/people" element={<PeopleDirectory />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
