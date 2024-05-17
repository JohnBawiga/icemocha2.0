import React from 'react'
import './page.css';
import TeacherArticleContent from './TeacherArticleContent';

function TeacherArticle() {
  return (
    <div>
    <div className='title'>
    <h1> ARTICLES</h1>
    </div>
    <div>
    <TeacherArticleContent/>
    </div>
  </div>
    
    )
}

export default TeacherArticle