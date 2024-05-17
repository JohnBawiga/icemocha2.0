package nstpcapstone1.sims.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import jakarta.transaction.Transactional;
import nstpcapstone1.sims.Entity.EventStudentEntity;
import nstpcapstone1.sims.Entity.EventTeacherEntity;

import java.util.List;

public interface EventStudentRepository extends JpaRepository<EventStudentEntity, Long> {
    List<EventStudentEntity> findByEventEventID(Long eventId);
    List<EventStudentEntity> findByStudentUserid(Long userid);
    Optional<EventStudentEntity> findByEventEventIDAndStudentUserid(Long eventId, Long studentId);
    List<EventStudentEntity> findByStudentUseridAndEventEventID(Long userid, Long eventID);
    boolean existsByStudentUseridAndEventEventID(Long userid, Long eventID);
    
    @Transactional
    @Modifying
    @Query("DELETE FROM EventStudentEntity e WHERE e.event.eventID = :eventId")
    void deleteByEventEventID(Long eventId);

}