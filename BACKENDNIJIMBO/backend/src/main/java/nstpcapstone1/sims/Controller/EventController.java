package nstpcapstone1.sims.Controller;

import java.sql.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import nstpcapstone1.sims.Entity.EventEntity;
import nstpcapstone1.sims.Entity.TeacherEntity;
import nstpcapstone1.sims.Repository.EventRepository;
import nstpcapstone1.sims.Service.EventService;
import nstpcapstone1.sims.Service.TeacherService;

@RestController
@CrossOrigin(origins="*")
public class EventController {
		private final EventRepository eventRepository;
	    private final TeacherService teacherService;
	    private final EventService eventService;

	    @Autowired
	    public EventController(EventRepository eventRepository, TeacherService teacherService, EventService eventService) {
	        this.eventRepository = eventRepository;
	        this.teacherService = teacherService;
	        this.eventService = eventService;
	    }
	@PostMapping("/events")
	public ResponseEntity<EventEntity> createEvent(
	        @RequestParam("eventTitle") String eventTitle,
	        @RequestParam("eventStart") Date eventStart,
	        @RequestParam("eventEnd") Date eventEnd,
	        @RequestParam(value = "image", required = false) MultipartFile image,
	        @RequestParam("description") String description) {
	    try {
	        // Create a new EventEntity
	        EventEntity event = new EventEntity();
	        event.setEventTitle(eventTitle);
	        event.setEventStart(eventStart);
	        event.setEventEnd(eventEnd);
	        event.setDescription(description);

	        // If image is provided, set it
	        if (image != null && !image.isEmpty()) {
	            byte[] imageData = image.getBytes();
	            event.setImage(imageData);
	        }

	        // Save the event
	        EventEntity savedEvent = eventRepository.save(event);

	        return new ResponseEntity<>(savedEvent, HttpStatus.CREATED);
	    } catch (Exception e) {
	        return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
	    }
	}
    @GetMapping("/getEvents")
    public List<EventEntity> getEvents(){
        return eventRepository.findAll();
    }
    @GetMapping("/getByEventid/{id}")
    public ResponseEntity<EventEntity> getEventById(@PathVariable Long id) {
        Optional<EventEntity> event = eventService.getEventById(id);
        if (event.isPresent()) {
            return ResponseEntity.ok(event.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @DeleteMapping("/deleteevent/{eventID}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long eventID) {
        eventService.deleteEvent(eventID);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
    @PutMapping("/updateevent/{eventID}")
    public ResponseEntity<EventEntity> updateEvent(@PathVariable Long eventID, @RequestBody EventEntity updatedEvent) {
        EventEntity existingEvent = eventService.get2EventById(eventID);

        if (existingEvent == null) {
            return ResponseEntity.notFound().build();
        }

        existingEvent.setEventTitle(updatedEvent.getEventTitle());
        existingEvent.setDescription(updatedEvent.getDescription());
        existingEvent.setEventStart(updatedEvent.getEventStart());
        existingEvent.setEventEnd(updatedEvent.getEventEnd());

        // Save the updated event
        EventEntity savedEvent = eventService.saveEvent(existingEvent);
        
        return ResponseEntity.ok(savedEvent);
    }
   
}
