package nstpcapstone1.sims.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;
import nstpcapstone1.sims.Entity.EventSectionEntity;

public interface EventSectionRepository extends JpaRepository<EventSectionEntity, Long>{
	List<EventSectionEntity> findByEventEventID(Long eventId);
	List<EventSectionEntity> sectionId(Long id);
    List<EventSectionEntity> findBySectionId(Long sectionId);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM EventSectionEntity e WHERE e.event.eventID = :eventId")
    void deleteByEventID(Long eventId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM EventSectionEntity es WHERE es.event.id = :eventId AND es.section.id = :sectionId")
    int deleteByEventIdAndSectionId(Long eventId, Long sectionId);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM EventSectionEntity es WHERE es.section.id = :id")
   int deleteBySectionId(Long id);
}
