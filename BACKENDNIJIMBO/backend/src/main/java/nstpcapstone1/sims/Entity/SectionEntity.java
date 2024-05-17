	package nstpcapstone1.sims.Entity;
	
	import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
	import jakarta.persistence.GeneratedValue;
	import jakarta.persistence.GenerationType;
	import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
	
	@Entity
	@Table(name = "tbl_section")
	public class SectionEntity {
	
	    @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;
	    
	   
	    @OneToOne(mappedBy = "section")
	    private TeacherSectionEntity teacherSection;
	    
	    private String sectionName;
	
		public SectionEntity() {
			super();
			// TODO Auto-generated constructor stub
		}
	
		public SectionEntity(Long id, String sectionName) {
			super();
			this.id = id;
			this.sectionName = sectionName;
		}
	
		public Long getId() {
			return id;
		}
	
		public void setId(Long id) {
			this.id = id;
		}
	
		public String getSectionName() {
			return sectionName;
		}
	
		public void setSectionName(String sectionName) {
			this.sectionName = sectionName;
		}
	
	}
