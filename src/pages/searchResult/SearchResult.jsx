import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import InfiniteScroll from 'react-infinite-scroll-component'
import './style.scss'
import { fetchDataFromApi } from '../../utils/api'
import ContentWrapper from '../../components/contentWrapper/ContentWrapper'
import MovieCard from '../../components/movieCard/MovieCard'
import Spinner from '../../components/spinner/Spinner'
import noResults from '../../assets/no-results.png'

const SearchResult = () => {
    const [data, setData] = useState(null)
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const { query } = useParams()

    const fetchInitialData = () => {
        setLoading(true)
        fetchDataFromApi(`/search/multi?query=${query}&page=${page}`).then((res) => {
            setData(res)
            setLoading(false)
            setPage((prev) => prev + 1)
        })
    }

    const fetchNextData = () => {
        setLoading(true)
        fetchDataFromApi(`/search/multi?query=${query}&page=${page}`).then((res) => {
            if (data?.results) {
                setData({
                    ...data,
                    results: [...data?.results, ...res.results]
                })
            } else {
                setData(res)
            }
            setPage((prev) => prev + 1)
            setLoading(false)
        })
    }

    useEffect(() => {
        setPage(1)
        fetchInitialData()
    }, [query])

    return (
        <div className='searchResultsPage'>
            {loading && <Spinner initial={true} />}
            {!loading && (
                <ContentWrapper>
                    {data?.results?.length > 0 ? (
                        <>
                            <div className="pageTitle">
                                {`Search Results for "${query}"`}
                            </div>
                            <InfiniteScroll
                                className='content'
                                dataLength={data?.results?.length || []}
                                next={fetchNextData}
                                hasMore={page <= data?.total_pages}
                                loader={<Spinner />}>
                                {data?.results?.map((item, index) => {
                                    if (item.media_type === 'person') return null
                                    return (
                                        <MovieCard
                                            key={index}
                                            data={item}
                                            fromSearch={true}
                                        />
                                    )
                                })}
                            </InfiniteScroll>
                        </>
                    ) : (
                        <span className="resultNotFound"> Results Not Found !</span>
                    )}
                </ContentWrapper>
            )
            }
        </div >
    )
}

export default SearchResult