import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { fetchDataFromApi } from './utils/api'
import { useSelector, useDispatch } from 'react-redux'
import { getApiConfigaration, getGenres } from './store/homeSlice'

import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Details from './pages/details/Details';
import SearchResult from './pages/searchResult/SearchResult';
import Explorer from './pages/explorer/Explorer';
// import PageNotFound from './pages/404/PageNotFound';

function App() {
  const dispatch = useDispatch()
  const { url } = useSelector((state) => state.home)

  useEffect(() => {
    fetchApiConfig();
    genresCall();
  }, [])

  const fetchApiConfig = () => {
    fetchDataFromApi('/configuration').then((data) => {
      const url = {
        backdrop: data.images.secure_base_url + data.images.backdrop_sizes[3],
        poster: data.images.secure_base_url + data.images.poster_sizes[6],
        profile: data.images.secure_base_url + data.images.profile_sizes[3],
      }
      dispatch(getApiConfigaration(url))
    })
  }

  const genresCall = async () => {
    let promises = [];
    let endpoints = ["tv", "movie"];
    let allGenres = {};

    endpoints.forEach((endpoint) => {
      return promises.push(fetchDataFromApi(`/genre/${endpoint}/list`));
    })
    const data = await Promise.all(promises);
    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item))
    });
    dispatch(getGenres(allGenres))
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:mediaType/:id" element={<Details />} />
        <Route path="/search/:query" element={<SearchResult />} />
        <Route path="/explore/:mediaType" element={<Explorer />} />
        {/* <Route path="*" element={<PageNotFound />} /> */}
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
