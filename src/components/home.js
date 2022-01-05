import React from 'react';
import { Row, Col } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Bestsellers from './bestsellers';
import Bookfeed from './bookfeed';
import Scrollspy from 'react-scrollspy';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state={
            checkusername: false,
            savedusername: '',
            allData: [],
            userData: []
        }
    }
    componentDidMount = () => {
        this.props.pathname(window.location.pathname)
        let usernameData = this.props.username;
        if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true
            }) 
        }
        this.getAllData();
    }
  
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
            }).then( () => {
                this.setState({
                    userData: this.state.allData.filter(one => one.username === this.state.savedusername)
                })
            })
    }
    renderReadingText(){
        let currentLength = this.state.allData.filter(each => each.username === this.props.username && each.status === "Currently-Reading").length;
        return this.state.allData.filter(each => each.username === this.props.username && each.status === "Currently-Reading").map((each, index) => 
                
                <span key={each.id}>{currentLength === index + 1 ?
                            <h4  ><em>{each.title}</em></h4>
                            :
                            <h4 > <em>{each.title}</em> <br />and </h4>
                        }
                </span>
        
        )
    }
    renderReading(){
        return this.state.allData.filter(each => each.username === this.props.username && each.status === "Currently-Reading").map((each) => 
            <Col key={each.id} xs={6}>
                <span>{each.image && each.image !== 'null' ?
                            <img src={each.image} alt={each.title} />
                            :
                            <div>
                                <h3><em>{each.title}</em></h3>
                            </div>
                        }
                </span>
            </Col>
        
        )
    }
    render(){
        const { savedusername} = this.state;
        let currentRead = this.state.allData.filter(each => each.username === this.props.username && each.status === "Currently-Reading");
        let friendsNum = this.state.allData.filter(each => each.username === this.props.username && each.friends !== "null");
        let welcomeContent;
        let sideContent;
        let homepageBreadcrumbs = 
           
                <div className="page-nav" id="home-breadcrumbs">
                    <Scrollspy items={ ['book-feed', 'best-sellers'] } currentClassName="is-current">
                        {friendsNum.length > 1 &&
                            <li><a href="#book-feed">Connections ></a></li>
                        }
                        <li><a href="#best-sellers">Bestsellers ></a></li>
                    </Scrollspy>
                </div>
           
        if(currentRead.length > 0 && this.props.customHome){
            sideContent =     
                <div id="current-home">
                    <Row>
                        <Col xs={6}>
                        <h3>You're reading:</h3>
                        {this.renderReadingText()}
                        </Col>
                        {this.renderReading()}
                    </Row>
                </div>
        }
        if(this.props.customHome && !this.props.newUser){
          welcomeContent = 
            <div className="welcome-top">
                <h1>Welcome back </h1>
                <p>View your <Link to='/books'>book list</Link> to make updates and add new books.</p>
                <p><Link to={'/friendsbooks'}>Find friends and follow</Link> to see what they're reading and recommend. </p>
            </div>
            
        }else if(this.props.newUser){
            welcomeContent =
                <div className="welcome-top">
                    <h1>Welcome to Book Ends  </h1>
                    <p>View your <Link to='/books'>book list</Link> to make updates and add new books.</p>
                    <p><Link to={'/friendsbooks'}>Find friends and follow</Link> to see what they're reading and recommend. </p>
                </div>
            
        }else{
            welcomeContent =
                <div className="welcome-top">
                    <h1>Welcome to your favorite book tracker</h1>
                    <p>Login to view your books or sign-up to create an account and start your list of books.</p>
                </div>
        }
        return(
            <article className="welcome">
                <Row>
                <Col md={7}>
                        {welcomeContent}
                        {homepageBreadcrumbs}
                        {sideContent}
                        {this.props.customHome &&
                            <Bookfeed currentuser={savedusername}/>
                        }
                </Col>
                <Col md={5}>
                    <div>
                        <Bestsellers />
                    </div>
                    </Col>
                </Row>

            </article>
           
        )
    }
}

export default Home;