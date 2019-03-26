import React, { Component } from 'react';
import { fetchData } from '../../utils/fetch'
import { key } from '../../utils/apiKEY';
import { cleanMovieData } from '../../utils/helpers';
import { connect } from 'react-redux';
import { addAllMovies, addAllShows, logOutUser } from '../../actions';
import MovieContainer from '../MovieContainer/MovieContainer';
import ShowsContainer from '../ShowsContainer/ShowsContainer';
import MovieDetails from '../../components/MovieDetails';
import Favorites from '../Favorites/favorites';
import { NavLink, Route } from 'react-router-dom';
import SignIn from '../SignIn/SignIn';
import SignUp from '../SignUp/SignUp';

class App extends Component {
  componentDidMount = () => {
    this.fetchMedia('tv')
    this.fetchMedia('movies')
  }

  fetchMedia = async (type) => {
    let url = `https://api.themoviedb.org/3/trending/${type}/day?api_key=${key}`;
    let allData = await fetchData(url);
    let cleanData = cleanMovieData(allData);
    type === 'tv' ? this.props.addAllShows(cleanData)
    : this.props.addAllMovies(cleanData)
  }

  SignOut = () => {
    this.props.logOutUser();
  }

  render() {
    const {message, user } = this.props
    return (
      <div className="App">
        <header>
        { !user &&
          <div>
            <NavLink to='/login' className="nav">Log In</NavLink>
            <NavLink to='/signup' className="nav">Sign Up</NavLink>
          </div>
        }
        {
          user &&
          <div>
            <button onClick={this.SignOut}>Log Out</button>
            <NavLink to='/favorites' className="nav">Favorites</NavLink>
          </div>
        }
        <h1>MOVIE TRACKER</h1>
        </header>
        <p className='message'>{message}</p>
        <Route exact path="/" render={() => (
          <div>
            <h2 className="sub-header">Recommended Movies</h2>
            <MovieContainer />
          </div>
        )} />
        <Route exact path="/" render={() => (
          <div>
            <h2 className="sub-header">Recommended TV Shows</h2>
            <ShowsContainer />
          </div>
        )} />
        <Route exact path='/login' component={SignIn} />
        <Route exact path='/signup' component={SignUp} />
        <Route exact path='/favorites' component={Favorites} />
        <Route path='/movies/:id' render={({ match }) => {
          const { id } = match.params
          const selectedMovie = this.props.movies.find(movie => {
            return movie.id == id
          })
          if(selectedMovie) {
            return <MovieDetails {...selectedMovie} />
          }
        }} />
        <Route path='/shows/:id' render={({ match }) => {
          const { id } = match.params
          const selectedMovie = this.props.shows.find(movie => {
            return movie.id == id
          })
          if(selectedMovie) {
            return <MovieDetails {...selectedMovie} />
          }
        }} />
      </div>
    )
  }
}


export const mapDispatchToProps = (dispatch) => ({
  addAllMovies: (movies) => dispatch(addAllMovies(movies)),
  addAllShows: (shows) => dispatch(addAllShows(shows)),
  logOutUser: (user) => dispatch(logOutUser())
})

const mapStateToProps = (state) => ({
  shows: state.shows,
  movies: state.movies,
  user: state.user.name,
  message: state.message
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
