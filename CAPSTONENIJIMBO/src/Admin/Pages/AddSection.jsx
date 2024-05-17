import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './AddSection.css'; 

Modal.setAppElement('#root');

function AddSection() {
    const [sectionName, setSectionName] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newSectionId, setNewSectionId] = useState(null);
    const [teacherId, setTeacherId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/getallteachers')
            .then(response => {
                setTeachers(response.data);
            })
            .catch(error => {
                console.error('Error fetching teachers:', error);
            });
    }, []);

    const handleChange = (event) => {
        setSectionName(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const newSection = {
            sectionName: sectionName
        };

        axios.post('http://localhost:8080/createSection', newSection)
            .then(response => {
                console.log('Section created:', response.data);
                setNewSectionId(response.data.id);
                setModalIsOpen(true);
            })
            .catch(error => {
                console.error('Error creating section:', error);

            });

        setSectionName('');
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setNewSectionId(null);
        setTeacherId('');
        setIsLoading(false);
    };

    const handleSubmitAssignTeacher = () => {
        setIsLoading(true);

        const teacherSectionData = {
            teacher: {
                userid: parseInt(teacherId) 
            },
            section: {
                id: newSectionId
            }
        };

        axios.post('http://localhost:8080/assignTeacherToSection', teacherSectionData)
            .then(response => {
                alert('Teacher Assigned to Section');

                setIsLoading(false);
                closeModal();
            })
            .catch(error => {
                alert('Error Assigning Teacher to Section');

                setIsLoading(false);
            });
    };

    return (
        <div className="add-section-container">
            <h1>Add Section</h1>
            <form onSubmit={handleSubmit} className="section-form">
            <div className="add-section-container1">
                <label>
                    Section Name:
                    <input
                        type="text"
                        value={sectionName}
                        onChange={handleChange}
                        required
                        className="section-input"
                    />
                </label>
                </div>
                <button type="submit" className="section-submit-button">Submit</button>
            </form>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="New Section ID Modal"
                className="section-modal"
                overlayClassName="section-overlay"
            >
                    <div className='section-content'>
                    <p>Section ID: {newSectionId}</p>
                    <label>
                        Teacher:
                        <select
                            value={teacherId}
                            onChange={(e) => setTeacherId(e.target.value)}
                            required
                            className="teacher-select"
                        >
                            <option value="">Select Teacher</option>
                            {teachers.map(teacher => (
                                <option key={teacher.userid} value={teacher.userid}>
                                    {teacher.firstName}  {teacher.lastName}
                                </option>
                            ))}
                        </select>
                    </label>
                    </div>
                <div className='section-buttons'>
                <button onClick={handleSubmitAssignTeacher} disabled={isLoading} className="assign-button">
                    {isLoading ? 'Assigning Teacher...' : 'Assign Teacher'}
                </button>
                <button onClick={closeModal} disabled={isLoading} className="close-button">Close</button>
                </div>
            </Modal>
        </div>
    );
}

export default AddSection;
