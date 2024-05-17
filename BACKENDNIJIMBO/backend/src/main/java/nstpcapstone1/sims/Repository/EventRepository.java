package nstpcapstone1.sims.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import nstpcapstone1.sims.Entity.EventEntity;

@Repository
public interface EventRepository extends JpaRepository<EventEntity, Long> {
}