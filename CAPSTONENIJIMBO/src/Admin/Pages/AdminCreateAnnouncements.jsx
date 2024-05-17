import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Link } from 'react-router-dom';
import './adminAnnouncement.css'

function AdminCreateAnnouncements() {
  const { adminID } = useParams(); 

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [date, setDate] = useState('');
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  
  const handleCloseModal = () => {
    setSuccessModalOpen(false);
  };

  const handleDate = (event) =>{
    const date = new Date(event.target.value);
    const formattedDate = date.toISOString().split('T')[0];
    console.log(formattedDate)
    setDate(formattedDate);
  }

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', image);
      formData.append('date', date);
      formData.append('adminID', adminID);

      const response = await axios.post(
        'http://localhost:8080/announcements/createann',
        formData,
        
      );

      const createdAnnouncement = response.data; 
      console.log(createdAnnouncement);
   
      setTitle('');
      setDescription('');
      setImage(null);
      setErrorMessage('');
   
      setSuccessModalOpen(true);
    } catch (error) {
      console.error('Error creating announcement:', error);
 
      setErrorMessage(error.response.data.message); 
    }
  };

  const modules = {
    toolbar: [
      [{ 'header':[1,2,3,4,5,6, false]}],
      [ 'bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];





  return (
    <section className='create-announcement'> 
      <div className='create-announcement-container'>
        <h1>Create Announcement</h1>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form className='form create-announcement_form' onSubmit={handleSubmit}>
          <div className="create-announcement-form-row">
            <input type="text" value={title} placeholder='  Announcement Title' onChange={handleTitleChange} required />
            <input type="date" value={date} onChange={handleDate} required/>
          </div>
          <div className="create-announcement-description">
            <ReactQuill defaultValue={description} onChange={setDescription} modules={modules} formats={formats} autofocus/>
          </div>
          <input className='create-announcement-add-img' type="file" accept="image/png, image/jpeg" onChange={handleImageChange} required />
          <button className='create-announcement-btn' type="submit">Create Announcement</button>
        </form>
        
        {successModalOpen && (
          <div className="created-announcement-modal">
            <div className="create-announcement-modal-content">
              <Link to={`/Admin/Announcements/${adminID}`}>
                <span className="created-announcement-close" onClick={handleCloseModal}>&times;</span>
              </Link>
              <p className='create-announcement-message'>Announcement successfully created!</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
  
}

export default AdminCreateAnnouncements;

