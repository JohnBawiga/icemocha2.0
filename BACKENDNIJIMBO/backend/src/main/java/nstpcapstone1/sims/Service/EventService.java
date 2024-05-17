package nstpcapstone1.sims.Service;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nstpcapstone1.sims.Entity.AnnouncementEntity;
import nstpcapstone1.sims.Entity.EventEntity;
import nstpcapstone1.sims.Repository.EventRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;

    @Autowired
    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public EventEntity saveEvent(EventEntity eventEntity) {
        return eventRepository.save(eventEntity);
    }

    public Optional<EventEntity> getEventById(Long id) {
        return eventRepository.findById(id);
    }
    public void deleteEvent(Long eventID) {
        eventRepository.deleteById(eventID);
    }
    public EventEntity updateEvent(Long id, EventEntity updatedEvent) {
        EventEntity existingEvent = eventRepository.findById(id).orElse(null);
        if (existingEvent != null) {
            // Update existingEvent fields with updatedEvent fields
          existingEvent.setEventTitle(updatedEvent.getEventTitle());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setEventStart(updatedEvent.getEventStart());
            existingEvent.setEventEnd(updatedEvent.getEventEnd());
            existingEvent.setImage(updatedEvent.getImage());


            // Save and return the updated event
            return eventRepository.save(existingEvent);
        } else {
            // If event with given id not found, return null or throw exception
            return null;
        }
    }
    public EventEntity get2EventById(Long eventID) {
        Optional<EventEntity> eventOptional = eventRepository.findById(eventID);
        return eventOptional.orElse(null);
    }
   
}
