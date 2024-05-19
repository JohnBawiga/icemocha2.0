import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminTeachers.css';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserXmark, faTrash } from '@fortawesome/free-solid-svg-icons';

function AdminTeachers() {
    const [teachers, setTeachers] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpen2, setModalOpen2] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
   
    const [modalError, setModalError]= useState(false);
    const [students, setStudents] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [sectionName, setSectionName] = useState('');
    const [teachersForSection, setTeachersForSection] = useState([]);
    const { adminID } = useParams();

    useEffect(() => {
        axios.get('http://localhost:8080/getallteachers')
            .then(response => {
                setTeachers(response.data);
            })
            .catch(error => {
                console.error('Error fetching teachers:', error);
            });
    }, []);

    useEffect(() => {
        axios.get('http://localhost:8080/getAllSections')
            .then(response => {
                setSections(response.data);
            })
            .catch(error => {
                console.error('Error fetching sections:', error);
            });
    }, []);

    const deleteTeacher = (userid) => {
        axios.delete(`http://localhost:8080/deleteteacher/${userid}`)
            .then(response => {
                setTeachers(teachers.filter(teacher => teacher.userid !== userid));
                alert("Teacher deleted successfully.");
            })
            .catch(error => {
                if (error.response && error.response.status === 500) {
                    setModalMessage("Student is assigned to the teacher. Teacher cannot be deleted.");
                    setModalError(true);
                } else {
                    console.error('Error deleting teacher:', error);
                }
            });
    };

  

    const deleteSection = async (sectionId) => {
        try {
            await axios.delete(`http://localhost:8080/deleteteachersection/${sectionId}`);
            await axios.delete(`http://localhost:8080/deletestudentsection/${sectionId}`);
            await axios.delete(`http://localhost:8080/deleteeventsection/${sectionId}`)
            await axios.delete(`http://localhost:8080/deletesection/${sectionId}`);
            setSections(sections.filter(section => section.id !== sectionId));
            alert("Section deleted successfully.");
        } catch (error) {
            console.error('Error deleting section:', error);
            setModalMessage("An error occurred while deleting the section. Please try again.");
            setModalError(true);
        }
    };

    const handleTeacherClick = (teacher) => {
        setSelectedTeacher(teacher);
        setSelectedSection(null);
        setModalOpen(true);
    };

    const handleSectionClick = (sectionId) => {
        axios.get(`http://localhost:8080/getbySectionid/${sectionId}`)
            .then(response => {
                setSectionName(response.data.sectionName);
            })
            .catch(error => {
                console.error('Error fetching section name:', error);
            });

        // Fetch students associated with the selected section
        axios.get(`http://localhost:8080/sections/${sectionId}`)
            .then(response => {
                setStudents(response.data);
                setSelectedSection(sectionId);
                setModalOpen2(true); // Open section modal
                axios.get(`http://localhost:8080/teachersections/${sectionId}`)
                    .then(teacherResponse => {
                        setTeachersForSection(teacherResponse.data);
                    })
                    .catch(error => {
                        console.error('Error fetching teachers for section:', error);
                    });
            })
            .catch(error => {
                setModalMessage("There are no students for this section.");
                setModalError(true);
            });
    };
    const closeModal = () => {
        setModalError(false);
        setModalMessage('');
    };
return (
    <div className="AT-container">
    <div class="AT-S-container">
    <div className="AT-S-table-container">
        <div class="AT-S-header">
            <h1>List of Sections</h1>
            <a href={`/Admin/AddSection/${adminID}`}><FontAwesomeIcon icon={faPlus} /></a>
        </div>
        <table>
        <tbody>
    {sections.map(section => (
        <tr key={section.id} onClick={() => handleSectionClick(section.id)}>
             <td className="teacher-table-cell"> 
            <div className="teacher-info">
                <span>
            <td >{section.sectionName}</td>
            </span>
            <div className="delete-teacher-button-container">
                <button className="delete-Teacher" onClick={(e) => { e.stopPropagation(); deleteSection(section.id) }} style={{ background: 'transparent', border: 'none', padding: '0 5px'}}>
                <FontAwesomeIcon icon={faTrash} style={{ color: '#690202' }}/>
                </button>
                </div>
                </div>
            </td>
        </tr>
    ))}
</tbody>
        </table>
    </div>
</div>


            <div className="AT-T-container">
            <div class="AT-T-table-container">
            <div className="AT-T-header">
                <h1>List of Teachers</h1>
                <Link to={`/Admin/AddTeacher/${adminID}`}> <FontAwesomeIcon icon={faPlus} /> </Link>
            </div>
            <table>
            <tbody>
            {teachers.map(teacher => (
                    <tr key={teacher.userid} onClick={() => handleTeacherClick(teacher)}>
                        <td className="teacher-table-cell">
                        <div className="teacher-info">
                        <span>
                            {teacher.firstName} {teacher.lastName} - ID: {teacher.teacherID}
                        </span>
                            <div className="delete-teacher-button-container">
                            <button classname="delete-Teacher" onClick={(e) => { e.stopPropagation(); deleteTeacher(teacher.userid) }}style={{ background: 'transparent', border: 'none', padding: '0 5px'}} >
                                <FontAwesomeIcon icon={faUserXmark} style={{ color: '#690202' }}/>
                            </button>
                            </div>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
           
        </div>


        {modalOpen && selectedTeacher && (
                <div className="teacher-modal">
                    <div className="teacher-modal-content">
                        <span className="AT-close" onClick={() => setModalOpen(false)}>&times;</span>
                        <h1>Teacher Details</h1>
                        <div className="teacher-image">
                            <img src={`data:image/png;base64,${selectedTeacher.profile}`} alt={selectedTeacher.firstName} />
                        </div>
                        <p>Teacher ID: {selectedTeacher.teacherID}</p>
                        <p>Teacher Name: {selectedTeacher.firstName} {selectedTeacher.lastName}</p>
                        <p>Email: {selectedTeacher.email} </p>
                        <p>Assigned Year: {selectedTeacher.assignedYear}</p>
                    </div>
                </div>
            )}

            {modalOpen2 && selectedSection && (
                <div className="AT-section-modal">
                    <div className="AT-section-modal-content">
                        <span className="AT-close" onClick={() => setModalOpen2(false)}>&times;</span>
                        <h1>{sectionName}</h1>
                        <h3>Teacher:</h3>
                        <ul>
                            {teachersForSection.map(item => (
                                <li key={item.teacher.userid}>
                                    {item.teacher.firstName} {item.teacher.lastName} (ID: {item.teacher.teacherID})
                                </li>
                            ))}
                        </ul>
                        <h3>Students:</h3>
                        <div className="AT-student-table-container">

                        <table className="AT-student-table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>ID</th>
                     </tr>
                   </thead>
                  <tbody>
                       {students.map(student => (
                         <tr key={student.student.userid}>
                             <td>{student.student.firstName} {student.student.lastName}</td>
                                <td>{student.student.studentID}</td>
            </tr>
                     ))}
                 </tbody>
                </table>
                    </div>
                </div>
                </div>
            )}
 {modalError && (
                <div className="AT-Error-modal">
                    <div className="AT-Error-modal-content">
                        <span className="AT-close" onClick={closeModal}>&times;</span>
                        <h3>{modalMessage}</h3>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminTeachers;
