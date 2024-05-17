package nstpcapstone1.sims.Service;

import nstpcapstone1.sims.Entity.ArticleEntity;
import nstpcapstone1.sims.Repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ArticleService {

    private final ArticleRepository articleRepository;

    @Autowired
    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public ArticleEntity createArticle(ArticleEntity articleEntity) {
        return articleRepository.save(articleEntity);
    }

    public ArticleEntity getArticleById(Long articleID) {
        Optional<ArticleEntity> articleOptional = articleRepository.findById(articleID);
        return articleOptional.orElse(null);
    }

    public ArticleEntity updateArticle(Long id, ArticleEntity updatedArticle) {
        ArticleEntity existingArticle = articleRepository.findById(id).orElse(null);
        if (existingArticle != null) {
            // Update existingAnnouncement fields with updatedAnnouncement fields
            existingArticle.setTitle(updatedArticle.getTitle());
            existingArticle.setDescription(updatedArticle.getDescription());
            existingArticle.setDate(updatedArticle.getDate());
            existingArticle.setImage(updatedArticle.getImage());
            existingArticle.setAdminID(updatedArticle.getAdminID());

            // Save and return the updated announcement
            return articleRepository.save(existingArticle);
        } else {
            // If announcement with given id not found, return null or throw exception
            return null;
        }
    }
    public void deleteArticle(Long articleID) {
        articleRepository.deleteById(articleID);
    }

    public List<ArticleEntity> getAllArticles() {
        return articleRepository.findAll();
    }
    public ArticleEntity saveArticle(ArticleEntity article) {
        return articleRepository.save(article);
    }
   
}
