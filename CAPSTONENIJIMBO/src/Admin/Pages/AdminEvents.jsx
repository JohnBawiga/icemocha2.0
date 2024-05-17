import React from 'react'
import AdminEventContent from './AdminEventContent'
import { Link, useParams } from 'react-router-dom';



function AdminEvents() {
  const {adminID} = useParams();
  return (
    <div>
      <div className='title'>
      <h1> EVENTS</h1>
      <Link to={`/Admin/CreateEvent/${adminID}`} className='event-linkad'>Create Event</Link>
      </div>
      <div>
      <AdminEventContent/>
      </div>
    </div>

  )
}

export default AdminEvents