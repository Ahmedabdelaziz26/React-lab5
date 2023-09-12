import axios from "axios";

import React, { useContext, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Pagination from "react-bootstrap/Pagination";
import { Link, useNavigate } from "react-router-dom";

import "./Home.css";
import axiosInstance from "../axiosConfig/axiosInstance";
import { MdOutlineFavorite } from "react-icons/md";
import { Progress } from "../ProgressCircle/ProgressCircle";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../store/slices/favorite";
import Spinner from "../Spinner/Spinner";
import { moviesAction } from "../../store/slices/movies";

function Home() {
  const [page, setpage] = useState(1);
  const [checkFavorite, setCheckFavorite] = useState([]);
  const loader = useSelector((state) => state.loader.loader);

  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.movies);

  useEffect(() => {
    // Dispatch the moviesAction when the component mounts
    dispatch(moviesAction(page));
  }, [dispatch]);

  const navigate = useNavigate();

  function handleImageClick(event) {
    // console.log(event);
    // console.log(event.target.id);
    navigate(`/single/${event.target.id}`);
  }

  // HANDEL ADD FAVORITE WITH DISBATCH
  const favorite = useSelector((state) => state.favorite.favorite);

  const handleAddToFavorites = (movie) => {
    const movieId = movie.id;
    if (favorite.some((favMovie) => favMovie.id === movieId)) {
      // Movie is already in favorites, remove it
      dispatch(removeFavorite(movie.id));
      console.log("movie removed from favorites");
    } else {
      // Movie is not in favorites, add it
      dispatch(addFavorite(movie));
      console.log("movie added to favorites");
    }
  };
  console.log(favorite);

  // check if favorites contains the movie to change color of Fav Icon
  const isFavorite = (movieID) =>
    movieID && favorite.some((favMovie) => favMovie.id === movieID);

  // Function to handle clicking on a page
  function goNext() {
    setpage(page + 1);
    console.log(page);
    dispatch(moviesAction(page));
  }
  function goPrev() {
    const prevP = page - 1;
    if (prevP >= 1) {
      setpage(prevP);

      console.log(prevP);
      dispatch(moviesAction(prevP));
    } else {
      return page == 2;
    }
  }
  // function pageClick(event) {
  //   console.log(event.target.textContent);
  // }

  const [currentPage, setCurrentPage] = useState(1);
  const pageClick = (pageNumber) => {
    if (pageNumber >= 1) {
      dispatch(moviesAction(pageNumber));

      setCurrentPage(pageNumber);
    }
  };

  // Function to generate Pagination.Item components for the next 5 pages
  const generatePaginationItems = () => {
    const items = [];
    for (let i = currentPage + 1; i <= currentPage + 5; i++) {
      items.push(
        <Pagination.Item
          key={i}
          onClick={() => {
            pageClick(i);
          }}
          active={i === currentPage}
        >
          {i}
        </Pagination.Item>
      );
    }
    console.log(items);
    return items;
  };

  return (
    <>
      <div className="container ">
        <div className="row">
          <h1 className="pt-2 mt-2">Popular Movies</h1>
          <div className="col-2">
            <div className="col-md-2 mt-5">
              <h3>ASide</h3>
            </div>
          </div>

          <div className="col-10 row">
            {/* //card */}
            {movies.map((movie) => (
              <div key={movie.id} className="col-md-3 my-5">
                <Col>
                  <Card className="shadow rounded-3">
                    {loader ? (
                      <span calssName="">
                        <Spinner />
                      </span>
                    ) : (
                      <Card.Img
                        id={movie.id}
                        variant="top"
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path} `}
                        onClick={() => {
                          handleImageClick(event);
                        }}
                      />
                    )}
                    <span className="progressStyle">
                      <Progress precentage={movie.vote_average * 10} />
                      <div className="progressStylePrec">
                        {movie.vote_average * 10} <span>%</span>
                      </div>
                    </span>
                    <span
                      className="favorite-icon  fs-2 text-end"
                      onClick={() => handleAddToFavorites(movie)}
                    >
                      {isFavorite(movie.id) ? (
                        <MdOutlineFavorite style={{ fill: "red" }} />
                      ) : (
                        <MdOutlineFavorite style={{ fill: "wheat" }} />
                      )}
                    </span>
                    <Card.Body className="d-flex flex-column justify-content-start align-self-start">
                      <div className="cardBody">
                        <span className="fw-bolder my-0 py-3 ">
                          <Link
                            className="anchorStyle "
                            to={`/single/${movie.id}`}
                          >
                            {movie.original_title}
                          </Link>
                        </span>

                        <span className="my-0 pt-1 text-secondary cardBodyT">
                          {movie.release_date}
                        </span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </div>
            ))}
            <Pagination className="container d-flex bg-dark justify-content-center text-center">
              <Pagination.Prev onClick={() => pageClick(currentPage - 1)} />
              <Pagination.Item
                onClick={() => pageClick(1)}
                active={currentPage === 1}
              >
                {1}
              </Pagination.Item>
              {generatePaginationItems()}
              <Pagination.Next onClick={() => pageClick(currentPage + 1)} />
            </Pagination>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
