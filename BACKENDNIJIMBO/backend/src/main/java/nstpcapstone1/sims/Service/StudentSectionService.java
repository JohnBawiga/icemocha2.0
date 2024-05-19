package nstpcapstone1.sims.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import nstpcapstone1.sims.Entity.StudentSectionEntity;
import nstpcapstone1.sims.Repository.StudentSectionRepository;

@Service
public class StudentSectionService {
	private final StudentSectionRepository studentSectionRepository;

	@Autowired
	public StudentSectionService(StudentSectionRepository studentSectionRepository) {
	    this.studentSectionRepository = studentSectionRepository;
	}

	public void assignStudentToSection(StudentSectionEntity studentSectionEntity) {
	    studentSectionRepository.save(studentSectionEntity);
	}

	public List<StudentSectionEntity> getAllStudentSections() {
	    return studentSectionRepository.findAll();
	}
	 @Transactional
	 public boolean deleteBySectionId(Long id) {
	        int deleted = studentSectionRepository.deleteBySectionId(id);
	        return deleted > 0;
	    }
}
