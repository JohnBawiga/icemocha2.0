package nstpcapstone1.sims.Controller;

import nstpcapstone1.sims.Entity.ArticleEntity;
import nstpcapstone1.sims.Repository.ArticleRepository;
import nstpcapstone1.sims.Service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.sql.Date;
import java.util.List;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleService articleService;

    @Autowired
    public ArticleController(ArticleService articleService) {
        this.articleService = articleService;
    }

    @Autowired
    private ArticleRepository articleRepository;


    // Read operation
    @GetMapping("getart/{articleID}")
    public ResponseEntity<ArticleEntity> getArticleById(@PathVariable Long articleID) {
        ArticleEntity article = articleService.getArticleById(articleID);
        return ResponseEntity.ok(article);
    }

    // Update operation
    @PutMapping("/updateart/{articleID}")
    public ResponseEntity<ArticleEntity> updateArticle(@PathVariable Long articleID, @RequestBody ArticleEntity updatedArticle) {
        ArticleEntity existingArticle = articleService.getArticleById(articleID);

        if (existingArticle == null) {
            return ResponseEntity.notFound().build();
        }

        // Update the existing announcement with the new details
        existingArticle.setTitle(updatedArticle.getTitle());
        existingArticle.setDescription(updatedArticle.getDescription());
        existingArticle.setDate(updatedArticle.getDate());
        existingArticle.setImage(updatedArticle.getImage());
        existingArticle.setAdminID(updatedArticle.getAdminID());

        // Save the updated announcement
        ArticleEntity savedArticle = articleService.saveArticle(existingArticle);
        
        return ResponseEntity.ok(savedArticle);
    }
   

    // Delete operation
    @DeleteMapping("deleteart/{articleID}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long articleID) {
        articleService.deleteArticle(articleID);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    // Get all announcements
    @GetMapping("getall")
    
    public ResponseEntity<List<ArticleEntity>> getAllArticles() {
        List<ArticleEntity> articles = articleService.getAllArticles();
        return ResponseEntity.ok(articles);
    }
    
    @PostMapping("createart")
    public ResponseEntity<ArticleEntity> createArticle(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("date") Date date,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("adminID") Long adminID) {
        try {
            // Create a new AnnouncementEntity
            ArticleEntity article = new ArticleEntity();
            article.setTitle(title);
            article.setDescription(description);
            article.setDate(date);
            article.setAdminID(adminID);

            // If image is provided, set it
            if (image != null && !image.isEmpty()) {
                byte[] imageData = image.getBytes();
                article.setImage(imageData);
            }

            // Save the announcement
            ArticleEntity savedArticle = articleRepository.save(article);

            return new ResponseEntity<>(savedArticle, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    
}
