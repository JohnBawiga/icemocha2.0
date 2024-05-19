package nstpcapstone1.sims.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import nstpcapstone1.sims.Entity.EventEntity;
import nstpcapstone1.sims.Entity.EventSectionEntity;
import nstpcapstone1.sims.Entity.SectionEntity;
import nstpcapstone1.sims.Repository.AdminRepository;
import nstpcapstone1.sims.Repository.EventRepository;
import nstpcapstone1.sims.Repository.EventSectionRepository;
import nstpcapstone1.sims.Repository.SectionRepository;

@Service
public class EventSectionService {
	private final EventSectionRepository eventSectionRepository;
	private final EventRepository eventRepository;
	private final SectionRepository sectionRepository;
	@Autowired
	public EventSectionService(EventSectionRepository eventSectionRepository, EventRepository eventRepository, SectionRepository sectionRepository) {
	    this.eventSectionRepository = eventSectionRepository;
	    this.eventRepository = eventRepository;
	    this.sectionRepository = sectionRepository;
	}

	public void assignSectionToEvent(EventSectionEntity eventSectionEntity) {
	    eventSectionRepository.save(eventSectionEntity);
	}
	 public void deleteByEventID(Long eventId) {
	        eventSectionRepository.deleteByEventID(eventId);
	    }
	 @Transactional
	    public boolean deleteByEventIdAndSectionId(Long eventId, Long sectionId) {
	        int deleted = eventSectionRepository.deleteByEventIdAndSectionId(eventId, sectionId);
	        return deleted > 0;
	    }
	 public EventSectionEntity createEventSection(EventSectionEntity eventSectionEntity) {
	        // Fetch the existing SectionEntity from the database
	        SectionEntity section = sectionRepository.findById(eventSectionEntity.getSection().getId())
	                .orElseThrow(() -> new RuntimeException("Section not found"));

	        // Set the managed SectionEntity on the EventSectionEntity
	        eventSectionEntity.setSection(section);

	        // Save the EventSectionEntity
	        return eventSectionRepository.save(eventSectionEntity);
	    }
	 
	 @Transactional
	 public boolean deleteBySectionId(Long id) {
	        int deleted = eventSectionRepository.deleteBySectionId(id);
	        return deleted > 0;
	    }
}
