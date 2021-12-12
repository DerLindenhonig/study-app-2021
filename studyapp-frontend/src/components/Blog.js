import React, {useState} from 'react'
import blogService from '../services/blogs'
import Cards from './Cards'
import Togglable from './Togglable'
import EditBlogForm from './EditBlogForm'
import {Link} from 'react-router-dom'

const Blog = ({ blog, user, setRefreshedBlogs, setBlogs, blogs }) => {
  if(!blog) {
    return null
  }

  const [like, setLike] = useState(false)

  const GameBtn = () => {
    if (blog.user.username === user.username) {
      return (
        <Game/>
      )
    } else return null
  }

  const EditBlogBtn = () => {
    if (blog.user.username === user.username) {
      return (
        <Togglable buttonLabel='edit'>
          <EditBlogForm editBlog={handleEditBlog} likes={blog.likes} user={user}/>
        </Togglable>
      )
    } else {
      return null
    }
  }

  const handleEditBlog = (blogObject) => {
    blogService
      .update(blog.id, blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        const allBlogs = blogService.getAll()
        setRefreshedBlogs(allBlogs)
      })
  }

  const addLike = async event => {
    event.preventDefault()
    setLike(true)

    const newBlog = {
      likes: blog.likes + 1,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user
    }
    await blogService.update(blog.id, newBlog)
    const allBlogs = await blogService.getAll()
    setRefreshedBlogs(allBlogs)
  }

  const removeLike = async event => {
    event.preventDefault()
    setLike(false)

    const newBlog = {
      likes: blog.likes - 1,
      title: blog.title,
      author: blog.author,
      url: blog.url,
      user: blog.user,
    }
    await blogService.update(blog.id, newBlog)
    const allBlogs = await blogService.getAll()
    setRefreshedBlogs(allBlogs)
  }

  const Liking = () => {
    for(let i = 0; i < user.likedBlogs; i++) {
      if(user.likedBlogs[i] === blog.id) {
        setLike(true)
      } else {
        setLike(false)
      }
    }
    if(like === false) {
      return <button id='like' onClick={addLike}>like</button>
    } else {
      return <button id='like' onClick={removeLike}>remove like</button>
    }
  }

  const Game = () => {
    return (
      <div>
        <Link to={`/games/${blog.id}`}><button>start game</button></Link>
      </div>
    )
  }

  return (
    <div>
      <br/>
      <h2>{blog.title}</h2>
      <div>status: {blog.status}</div>
      <div>creator: {blog.author}</div>
      <div>description: {blog.url}</div>
      <div>likes: {blog.likes}<Liking/></div>
      <br/>
      <EditBlogBtn/>
      <br/>
      <Cards blog={blog} user={user} setRefreshedBlogs={setRefreshedBlogs} blogs={blogs}/>
      <GameBtn/>
      <br/>
    </div>
  )
}

export default Blog