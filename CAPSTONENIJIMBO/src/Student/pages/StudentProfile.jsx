import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import QRCode from 'react-qr-code';
import './StudentProfile.css';

const QRCodeModal = ({ studentID, closeModal }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="QRcodeforStudentID">QR Code for Student ID</h3>
        <QRCode className='QRCode' value={studentID} />
        <button className='closeQR' onClick={closeModal}>Close QR Code</button>
      </div>
    </div>
  );
};

const StudentProfile = () => {
  const { studentID } = useParams();
  const [student, setStudent] = useState('');
  const [qrVisible, setQrVisible] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [sections, setSections] = useState([]);
  const [selectedSection, setSelectedSection] = useState('');
  const [assignedSections, setAssignedSections] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const onClickFunction = () => {
    assignSection();
    assignSectionName();
 
   };
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/getByStudentID/${studentID}`);
        setStudent(response.data);
      } catch (error) {
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentID]);

  const handleFileChange = (event) => {
    setProfilePicture(event.target.files[0]);
  };

  const updateProfilePicture = async (event) => {
  const selectedFile = event.target.files[0];
  if (!selectedFile) {
    console.error('Please select a profile picture.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('profile', selectedFile);
    const response = await axios.put(`http://localhost:8080/addpicture/${studentID}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Update the profile picture in the UI after successful upload
    setProfilePicture(selectedFile);
  } catch (error) {
    console.error('Error updating profile picture:', error);
  }
};



  const closeModal = () => {
    setShowModal(false);
    setQrVisible(false);
    window.location.reload();
  };
  const closeModal2 = () => {
    setShowModal(false);
    setQrVisible(false);
   
  };

  const assignSection = async () => {
    try {
      const response = await axios.post('http://localhost:8080/assignStudentToSection', {
        student: { userid: student.userid },
        section: { id: selectedSection }
      });
      setShowModal(true);
    } catch (error) {
      console.error('Error assigning section:', error);
    }
  };

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get('http://localhost:8080/getAllSections');
        setSections(response.data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };

    fetchSections();
  }, []);
  useEffect(() => {
    const fetchAssignedSections = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/studentsection/${student.userid}`);
      
        setAssignedSections(response.data);

      } catch (error) {
        console.error('Error fetching assigned sections:', error);
      }
    };

    fetchAssignedSections();
  }, [student.userid]);


  const assignSectionName = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/students/${studentID}/section`, null, {
        params: {
          section: selectedSection
        }
      });
      setShowModal(true); // Show modal upon successful section name assignment
    } catch (error) {
      console.error('Error assigning section name:', error);
    }
  };
  
  return (
  <div className='student-profile'>
    <h2>Student Profile</h2>
    <div className="profile-details">
      <div className='student-profile-picture'>
        <div className='profile'>
          {/* Conditional rendering for profile picture */}
          {(profilePicture && <p><img src={URL.createObjectURL(profilePicture)} alt={student.firstName} style={{ width: '100%' }} /></p>) ||
            (student.profile && <p><img src={`data:image/png;base64,${student.profile}`} alt={student.firstName} style={{ width: '100%' }} /></p>)
          }
          <input id="profile-picture" type="file" accept="image/*" onChange={updateProfilePicture} style={{ display: 'none' }} />
          <label htmlFor="profile-picture" className="choosefile">Update Profile Picture</label>
        </div>
      </div>
      {/* Remaining profile details */}
      <div className="student-profile-credentials">
        <p><strong>Student ID:</strong><br /><span className="entered-value">{student.studentID}</span></p>
        <p><strong>Name:</strong><br /><span className="entered-value">{student.firstName} {student.lastName}</span></p>
        <p><strong>Email:</strong><br /><span className="entered-value">{student.email}</span></p>
        <p><strong>Course:</strong><br /><span className="entered-value">{student.course}</span></p>

        {/* Dropdown for section selection */}
        <div className="student-section-dropdown">
          <p><strong> Section:</strong></p>
          {/* Dropdown logic */}
          {assignedSections.length > 0 ? (
            <p><span className="entered-value">{assignedSections[0].section.sectionName}</span></p>
          ) : (
            <select className='select-sec' onChange={(e) => setSelectedSection(e.target.value)}>
              <option  value="">Assign Section</option>
              {sections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.sectionName}
                </option>
              ))}
            </select>
          )}
          {assignedSections.length === 0 && (
            <button className='assign-sec' onClick={onClickFunction}>Assign Section</button>
          )}
        </div>
        {/* Modal for section assignment */}
        {showModal && (
          <div className="assign-section-modal-overlay">
            <div className="modal">
              <h3>Section Assigned!</h3>
              <button className='closeSection' onClick={closeModal}>Close</button>
            </div>
          </div>
        )}
        {/* Button for QR Code display and Logout */}
        <button className='QRbutton' onClick={() => setQrVisible(true)}>Show QR Code</button>
        <button className='logout-button' onClick={() => window.location.href = '/Student/Login'}>Logout</button>
      </div>
    </div>
    {/* Modal for QR Code */}
    {qrVisible && <QRCodeModal studentID={student.studentID} closeModal={closeModal2} />}
  </div>
);

};

export default StudentProfile;
