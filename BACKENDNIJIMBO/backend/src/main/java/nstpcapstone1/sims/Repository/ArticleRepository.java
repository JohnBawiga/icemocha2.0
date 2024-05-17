package nstpcapstone1.sims.Repository;

import nstpcapstone1.sims.Entity.ArticleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleRepository extends JpaRepository<ArticleEntity, Long> {
    // You can define custom query methods here if needed
}
