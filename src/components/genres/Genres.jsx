import React from 'react'
import { useSelector } from 'react-redux'
import './style.scss'

const Genres = ({ data }) => {
    const { genres } = useSelector(state => state.home)
    return (
        <div className='genres'>
            {data?.map((id) => {
                if (!genres[id]?.name) return;
                return (
                    <span key={id} className='genre'>{genres[id]?.name}</span>
                )
            })}
        </div>
    )
}

export default Genres