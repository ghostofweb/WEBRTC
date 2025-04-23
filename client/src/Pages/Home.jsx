import React from 'react'

const Home = () => {
  return (
    <div className='homepage-container'>
        <div className='input-container'>
            <input type="email" placeholder='Enter your email here' />
            <input type="text" placeholder='Enter Room Code' />
            <button>Join</button>
        </div>
    </div>
  )
}

export default Home