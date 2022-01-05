import React from 'react';
import { Route, Routes, BrowserRouter, NavLink} from 'react-router-dom';
import Home from './components/home';
import SignUp from './components/signup';
import SignIn from './components/signin';
import SignOut from './components/signout';
import BookForm from './components/bookform';
import FindUser from './components/finduser';
import FriendPage from './components/friendPage';
import './App.scss';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state={
        checkusername: false,
        savedusername: '',
        signOut: false,
        signIn: false,
        signup: false,
        newUser: false,
        customHome: false, 
        pathname: ''
      }
  }
  componentDidMount = () => {
    const pathname = window.location.pathname;
    this.setState({
      pathname: pathname
    })
    if(localStorage.getItem('username')){
      let usernameData = localStorage.getItem('username');
      this.setState({
        savedusername: usernameData,
        checkusername: true,
        customHome: true
    })
    }
    else{
      this.setState({
        checkusername: false
      })
    }
  }
  updateNav = () =>{
    if(localStorage.getItem('username')){
      let usernameData = localStorage.getItem('username');
      this.setState({
        savedusername: usernameData,
        checkusername: true,
        customHome: true
      })
    }
    else{
      this.setState({
        checkusername: false,
        customHome: false,
        savedusername: '',
      })
    }
  }
  getPathName = (pathname) => {
    this.setState({
      pathname: pathname
    })
  }
  showSignout = () => {
    this.setState({
      signOut: !this.state.signOut
    })
  }
  showSignin = () => {
    this.setState({
      signIn: !this.state.signIn,
      signup: false
    })
  }
  showSignup = () => {
    this.setState({
      signup: !this.state.signup,
      signIn: false
    })
  }
  showHome = () => {
    this.setState({
      signup: false,
      signIn: false,
      signOut: false
    })
  }
  newUser = () => {
    this.setState({
      newUser: true
    })
  }
  render(){
    const { checkusername, savedusername, signOut, signIn, signup, customHome, newUser, pathname} = this.state;
        let mainNav;
        mainNav =
          <BrowserRouter>
                {checkusername &&
                  <article className="navigation">
                    <React.Fragment>
                    <NavLink to="/" activeClassName="active" onClick={this.showHome}><i className="fa fa-book" aria-hidden="true"></i>&nbsp;Home</NavLink>
                    <NavLink activeClassName="active" to="/books" >Your books</NavLink>
                    <NavLink activeClassName="active" to="/friendsbooks" ><i className="fa fa-search" aria-hidden="true"></i>&nbsp;Friends</NavLink>
                    {pathname === '/' &&
                      <button onClick={this.showSignout} >Sign out</button>
                    }
                  </React.Fragment>
                  </article>
                }
                  {!checkusername &&
                  <article className="navigation">
                    <React.Fragment>
                      <NavLink activeClassName="active" to="/" onClick={this.showHome}><i className="fa fa-book" aria-hidden="true"></i>&nbsp;Home</NavLink>
                      <button onClick={this.showSignin} >Login</button>
                      <button onClick={this.showSignup} >Sign up</button>
                    </React.Fragment>
                  </article>
                  }
                   <Routes>
                    <Route  path="/books" element={<BookForm name={savedusername} pathname={this.getPathName}  />} />
                    <Route  path="/friendsbooks" element={<FindUser currentusername={savedusername} pathname={this.getPathName}/>}/>
                    <Route  path="/friendsbooks/friend/:friendname"  element={<FriendPage pathname={this.getPathName} />} />
                    <Route  path="/" element={<Home customHome={customHome} newUser={newUser} username={this.state.savedusername} pathname={this.getPathName}/>} />
                  </Routes>
          </BrowserRouter>
    return(
      <div className="App">
        <header className="App-header" >
          <h1>Book Ends</h1>
        </header>
        <article  id="layout">
        <div >
          {mainNav}
          {signOut &&
                <SignOut updateNav={this.updateNav} showSignout={this.showSignout} username={savedusername}/>
          }
          {signIn &&
                <SignIn updateNav={this.updateNav} showSignin={this.showSignin} username={savedusername}/>
          }
          {signup &&
                <SignUp updateNav={this.updateNav}  newUser={this.newUser} showSignup={this.showSignup} username={savedusername}/>
          }
        
        </div>
        </article>
        <footer>
          <article className="footer">
            <div>&copy; 2020</div>
          </article>
        </footer>
      </div>
        
    
    )
  }
}

export default App;
