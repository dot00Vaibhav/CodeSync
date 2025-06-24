import React from 'react'
import InitialsAvatar from './InitialsAvatar'

const Client = ({userName}) => {
  return (
    <div className='client'>
      <InitialsAvatar
        name={userName}
        size={45}
      />
      <span className='userName'>
        {userName}
      </span>
    </div>
  )
}

export default Client