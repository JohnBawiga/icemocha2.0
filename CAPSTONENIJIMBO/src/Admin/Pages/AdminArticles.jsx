import React from 'react'
import AdminArticleContent from './AdminArticleContent'
import { Link, useParams } from 'react-router-dom';
import './adminArticles.css';

function AdminArticles() {
    const {adminID} = useParams();
  return (
    <div>
      <div className='title'>
      <h1> Articles</h1>
      <Link to={`/Admin/CreateArticle/${adminID}`} className='article-linkad'>Create Article</Link>
      </div>
      <div>
      <AdminArticleContent/>
      </div>
    </div>

  )
}

export default AdminArticles