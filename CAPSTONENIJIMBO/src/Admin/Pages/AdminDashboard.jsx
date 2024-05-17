import React, { useEffect, useState } from 'react'
import './AdminDashboard.css';
import axios from 'axios';

function AdminDashboard({ adminID }) {
  const [teachers, setTeachers] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [sections, setSections] = useState([]);
  const [articles, setArticles] = useState([]);
 
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showArticleModal, setShowArticleModal] = useState(false);
  useEffect(() => {
    axios.get('http://localhost:8080/getallteachers')
        .then(response => {
            setTeachers(response.data.reverse());
        })
        .catch(error => {
            console.error('Error fetching teachers:', error);
        });
}, []);
useEffect(() => {
  // Fetch events from backend API
  axios.get('http://localhost:8080/getEvents')
    .then(response => {
      setEvents(response.data);
      const upcomingEvents = response.data.filter(upcoming => new Date(upcoming.eventStart) >= new Date());
      setUpcoming(upcomingEvents);
    })
    .catch(error => {
      console.error('Error fetching events:', error);
    });
}, []);



useEffect(() => {
  const fetchArticles = async () => {
    try {
      const response = await axios.get('http://localhost:8080/articles/getall');
      setArticles(response.data.reverse()); 
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  fetchArticles();

  return () => {
    setArticles([]);
  };
}, []);

// Function to get section name for a given teacher




const fetchTeacherDetails = (userid) => {
  axios.get(`http://localhost:8080/getbyUserid/${userid}`)
    .then(response => {
      setSelectedTeacher(response.data);
      setShowModal(true);
      // Fetch sections for the selected teacher
      axios.get(`http://localhost:8080/getbyteacherid/${response.data.teacherID}`)
        .then(sectionResponse => {
          // Update the teacher object with sections
          const updatedTeacher = {
            ...response.data,
            sections: sectionResponse.data.map(item => item.section.sectionName)
          };
          setSelectedTeacher(updatedTeacher);
          console.log(response.data.teacherID);
        })
        .catch(error => {
          console.error('Error fetching sections:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching teacher details:', error);
    });
};
const fetchArticleDetails = (articleID) => {
  axios.get(`http://localhost:8080/articles/getart/${articleID}`)
    .then(response => {
      setSelectedArticle(response.data);
      setShowArticleModal(true);
    })
    .catch(error => {
      console.error('Error fetching article details:', error);
    });
};
const fetchEventDetails = (eventID) => {
  axios.get(`http://localhost:8080/getByEventid/${eventID}`)
    .then(response => {
      setSelectedEvent(response.data);
      setShowEventModal(true);
    })
    .catch(error => {
      console.error('Error fetching event details:', error);
    });
};
const closeModal = () => {
  setShowTeacherModal(false);
  setSelectedTeacher(null);
  setShowArticleModal(false);
  setSelectedArticle(null);
};
return (
  <div className='adminDashboards'>
    <h1><strong>ADMIN DASHBOARD</strong></h1>
    
    <div className='adminDashboards-articles-container'>
      <h1><strong>Articles</strong></h1> 
      <div className='adminDashboards-category-item'>
        <h3>Total Articles</h3>
        <p>{articles.length}</p>
      </div>
      <div className='adminDashboards-category-item'>
        <h3>Latest Article</h3>
        <ul>
          {articles.length > 0 ? (
            <li key={articles[0].articleID} onClick={()=> fetchArticleDetails(articles[0].articleID)}>
              <strong>{articles[0].title}</strong>
            </li>
          ) : (
            <li>No Articles</li>
          )}
        </ul>
      </div>
      <div className='adminDashboards-category-item'>
  <h3>Articles</h3>
  <ul>
    {articles.length > 0 ? articles.map((article, index) => (
      <li key={article.articleID} onClick={() => fetchArticleDetails(article.articleID)}>
        <strong>{index + 1}. {article.title}</strong>
      </li>
    )) : <li>No articles</li>}
  </ul>
</div>
    </div>     
  
        <div className='adminDashboards-events-container'>
                <h1><strong>Events</strong></h1>
                <div className='adminDashboards-category-item'>
                    <h3>Total Events</h3>
                    <p>{events.length}</p>
                </div>
                <div className='adminDashboards-category-item'>
                    <h3>Upcoming Events</h3>
                    <ul>
  {upcoming.length > 0 ? upcoming.map((event, index) => (
    <li key={event.eventID} onClick={() => fetchEventDetails(event.eventID)}>
      <strong>{event.eventTitle}</strong>
    </li>
  )) : <li>No upcoming events</li>}
</ul>
                </div>
                <div className='adminDashboards-category-item'>
                    <h3>Events</h3>
                    {events.map((event, index) => (
                            <li key={event.eventID}>
                              <strong> {event.eventTitle}</strong>
                            </li>
                        ))}
                </div>
            </div>
        
            <div className='adminDashboards-teachers-container'>
        <h1><strong>Teachers</strong></h1>
        <div className='adminDashboards-category-item'>
          <h3>Total Teachers</h3>
          <p>{teachers.length}</p>
        </div>
        <div className='adminDashboards-category-item'>
          <h3>Teachers</h3>
          <ul>
            {teachers.length > 0 ? teachers.map((teacher, index) => (
              <li key={teacher.userid} onClick={() => fetchTeacherDetails(teacher.userid)}>
                <strong>{index + 1}. {teacher.firstName} {teacher.lastName}</strong>
              </li>
            )) : <li>No Teachers</li>}
          </ul>
        </div>
      </div>

      {showModal && selectedTeacher && (
  <div className="teacher-modal">
    <div className="teacher-modal-content">
      <span className="AT-close" onClick={() => closeModal(false)}>&times;</span>
      <h1>Teacher Details</h1>
      <div className="teacher-image">
        <img src={`data:image/png;base64,${selectedTeacher.profile}`} alt={selectedTeacher.firstName} />
      </div>
      <p>Teacher ID: {selectedTeacher.teacherID}</p>
      <p>Teacher Name: {selectedTeacher.firstName} {selectedTeacher.lastName}</p>
      <p>Email: {selectedTeacher.email}</p>
      <p>Assigned Year: {selectedTeacher.assignedYear}</p>
      {selectedTeacher.sections && selectedTeacher.sections.length > 0 && (
        <div>
          <p>Assigned Sections: {selectedTeacher.sections.join(', ')}</p>
        </div>
      )}
    </div>
  </div>
)}
      {showArticleModal && selectedArticle && (
        <div className='article-modal'>
      <div className='article-modal-content'>
      <div className='A-article-content'>
      <span className="close" onClick={closeModal}>&times;</span>
          <h1>Article Details</h1>
          <h3>{selectedArticle.title}</h3>
          <p>Date Created: {new Date(selectedArticle.date).toLocaleDateString()}</p>
          <p classname="A-article-description" dangerouslySetInnerHTML={{ __html: selectedArticle.description }}></p>
        </div>
          
          </div>
        </div>
      )}
      {showEventModal && selectedEvent && (
  <div className="article-modal">
    <div className="article-modal-content">
    <div className='A-article-content'>
      <span className="close" onClick={() => setShowEventModal(false)}>&times;</span>
      <h1>Event Details</h1>
      <p><img src={`data:image/png;base64,${selectedEvent.image}`} alt={selectedEvent.eventTitle} /> </p>
      <p><h1>{selectedEvent.eventTitle}</h1></p>
      <p classname="A-article-description" dangerouslySetInnerHTML={{ __html:selectedEvent.description}}></p>
      {/* Add other event details as needed */}
      </div>
    </div>
  </div>
)}
    </div>
    
  )
}


export default AdminDashboard