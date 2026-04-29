import './App.css'
import Post from './components/Post'
import NewPost from './components/NewPost.jsx'
import { Blog } from './Blog.jsx'
import { Routes, Route, Link } from 'react-router'
import { Home } from './Home.jsx'
import { Contact } from './Contact.jsx'
import Login from './components/Login'
import Author from './components/Author'

function App() {
  return (
    <>
    <nav><Link to="/blog">Blog</Link><Link to="/">Home</Link><Link to="/contact">Contact</Link><Link to="/login">Login</Link></nav>
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/blog" element={<Blog/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/new-post" element={<NewPost></NewPost>}/>
      <Route path="/blog/:id_post" element={<Post></Post>}></Route>
      <Route path='/login' element={<Login></Login>}></Route>
      <Route path='/autores/:id_author' element={<Author></Author>}></Route>
      <Route path='/authors/:id_author' element={<Author></Author>}></Route>
    </Routes>
    </>
  )
}

export default App
