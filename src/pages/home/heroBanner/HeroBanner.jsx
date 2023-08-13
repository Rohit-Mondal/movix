import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import "./style.scss"
import useFetch from '../../../hooks/useFetch'
import Img from '../../../components/lazyLoadImage/Img'
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'

const HeroBanner = () => {
    const [background, setBackground] = useState('')
    const [query, setQuery] = useState('');
    const navigate = useNavigate()
    const { url } = useSelector((state) => state.home)

    const { data, loading } = useFetch('/movie/upcoming');

    useEffect(() => {
        if (!loading) {
            setBackground(url.backdrop + data?.results?.[Math.floor(Math.random() * 20)]?.backdrop_path)
        }
    }, [data])

    const handleSearch = (e) => {
        if (e.key === 'Enter' && query.length > 0) {
            navigate(`/search/${query}`)
        }
    }

    return (
        <div className="heroBanner">
            {!loading && <div className="backdrop-img">
                <Img src={background} />
            </div>}
            <div className="opacity-layer" />
            <ContentWrapper>
                <div className="heroBannerContent">
                    <span className="title">Welcome</span>
                    <span className="subTitle">Millions of movies, TV shows and people to discover.
                        Explore Now</span>
                    <div className="searchInput">
                        <input type="text" onChange={(e) => setQuery(e.target.value)} onKeyUp={handleSearch} placeholder='Search for a movie or TV Show' />
                        <button>Search</button>
                    </div>
                </div>
            </ContentWrapper>
        </div>
    )
}

export default HeroBanner