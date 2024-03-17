import React from 'react'
import './Nodata.css';
import {Link} from 'react-router-dom'

const Nodata = () => {
  return (
    <div class="empty-data">
  <p>Mean While </p>
  
    <Link to='/upload'>Click here to Create a Post</Link>
</div>

  )
}


export default Nodata;