import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidV4 } from 'uuid';

const Home = () => {

  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");

  const navigate = useNavigate();

  const createNewRoom = (event) => {
    event.preventDefault();
    const id = uuidV4();
    console.log(id);
    setRoomId(id);
    toast.success("Created New Room");
  };
  
  const joinRoom = (event) => {
    if(!userName && roomId){
      toast.error("USERNAME REQUIRED");
      return;
    }
    else if(!roomId && userName){
      toast.error("ROOM ID REQUIRED");
      return;
    }else if(!roomId || !userName){
      toast.error("ROOM ID & USERNAME REQUIRED");
      return;
    }

    // Redirect to the editor page
    navigate(`/editor/${roomId}`, {
      state: {
        userName,
      }
    });
  }

  const enterHandler = (e) => {
    if(e.code === 'Enter'){
      joinRoom();
    }
  }

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img src='/code-sync.png' alt='Code-Collab-logo' className='homePageLogo' />
        <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
        <div className='inputGroup'>
          <input 
            type='text' 
            placeholder='ROOM ID'
            className='inputBox'
            onChange={(e) => setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={enterHandler}
          />
          <input 
            type='text' 
            placeholder='USERNAME'
            className='inputBox'
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            onKeyUp={enterHandler}
          />

          <button className='btn joinBtn' onClick={joinRoom}>Join</button>
          <span className='createInfo'>
            If you don't have an invite then create &nbsp;
            <a onClick={createNewRoom} href='' className='createNewBtn'>new room</a>
          </span>
        </div>
      </div>
      <footer>
        <h4>Team up. Code live. Ship faster</h4>
      </footer>
    </div>
  )
}

export default Home;