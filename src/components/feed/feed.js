import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './feed.css';
import {Link} from 'react-router-dom'
import LoadingSpinner from '../Loading/loading';
import  Nodata  from '../NoData/Nodata';

const Feed = () => {
  let [likes, setLikes] = useState(0)
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    fetchData();  
    setIsLoading(false);
  },[likes]);

  const handleToggleOptions = () => {
    setShowOptions(!showOptions);
  };

  const fetchData = async () => {
    
    try {
      
      const response = await axios.get('https://memories-server-1iig.onrender.com/getposts'); 
      setData(response.data);
      
    } catch (error) {
      console.error(error   );
    }
  };

  /////////////////////////////////////////////////////////////
  
   
  const IncLikes = (id, likes) => {
    const newLikes = likes + 1;
    setLikes(newLikes); 
    
    axios.patch(`https://memories-server-1iig.onrender.com/getposts/${id}`, { likes: newLikes })
      .then(res => {
        // console.log(res.data) 
      })
  }
  
  const DecLikes = (id, likes) => {
    const newLikes = likes - 1;
    setLikes(newLikes);
    
    axios.patch(`https://memories-server-1iig.onrender.com/getposts/${id}`, { likes: newLikes })
      .then(res => {
        console.log(res.data)
      })

  }
  //////////////////////////////////////////
  const deletePost = async (id)=>{

    const confirmed = window.confirm('Are you sure you want to delete this post?');
  if (confirmed) {
    try {
      await axios.delete(`https://memories-server-1iig.onrender.com/delete/${id}`);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }

  }



  
  if(isLoading)
  {
    return(<LoadingSpinner />)
  }

  if(data.length === 0)
  {
    return(
     <Nodata />
    )
  }

  return (

    <div classNameName="container">
      {

      data.slice(0).reverse().map((post) => (
        
        <div className="f-card child">
  <div className="header" key={post.id}>
    <div className="options" >
      <i className="fa fa-chevron-down" onClick={handleToggleOptions} key={post.id}></i>
    {showOptions && (
            <div className="options-list" style={{color:'black'}} >
              <div><i class="fa fa-edit">&nbsp;Edit</i></div>
              <div onClick={()=>deletePost(post._id)}><i className="fa fa-trash-o" >&nbsp;Delete</i></div>
            </div>
          )}
    </div>   
    <img className="co-logo" src="http://placehold.it/40x40" alt='*' />
    <div className="co-name"><Link>{post.name.charAt(0).toUpperCase() + post.name.slice(1)} Added a Post</Link></div>
    <div className="time"><Link>{post.createdAt.slice(2,10)}</Link>  <i className="fa fa-globe"></i></div>
  </div>
  <div className="content">
    <p>{post.description}</p>
  </div>
        
  <div className="reference">
    <img className="reference-thumb" src={post.url} alt={post.name}/>
    
  </div>
  <div className="social">
    <div className="social-content"></div>
    <div className="social-buttons">
      <span><button onClick={() => IncLikes(post._id, post.likes)}><i className="fa fa-thumbs-up"></i>{post.likes}</button></span>
      <span><button onClick={() => DecLikes(post._id, post.likes)}><i className="fa fa-thumbs-down"></i></button></span>
      <span><i className="fa fa-comment"></i>Comment</span>
      <span><i className="fa fa-share"></i>Share</span></div>
  </div>
</div>
      ))}
    </div>
  );
};

export default Feed;
