import React from 'react';
import moment from 'moment';
import { Link} from 'react-router-dom';
import Scrollspy from 'react-scrollspy';
import { Row, Col, Accordion, Card, AccordionContext, useAccordionButton  } from 'react-bootstrap';

function CustomToggle({ children, eventKey, callback }) {
    const currentEventKey = React.useContext(AccordionContext);
    const decoratedOnClick = useAccordionButton(
      eventKey,
      () => callback && callback(eventKey)
    );
  const isCurrentEventKey = currentEventKey === eventKey;
  return (
      <button
        type="button"
        className={isCurrentEventKey ? "open" : "closed" }
        onClick={decoratedOnClick}
      >
        {children}
      </button>
    );
}
class FriendData extends React.Component {
    constructor(props){
        super(props);
        this.state={
            allData: [],
            friendData: [],
            searchloading: true,
            friendString:'',
            firstName: ''
        }
    }
    componentDidMount =(props) => {
        console.log('friendname', this.props.friendname)
        this.setState({
            friendString: this.props.friendname.toLowerCase(),
            firstName: (this.props.friendname.toLowerCase().split('-')[0])[0].toUpperCase() + this.props.friendname.toLowerCase().split('-')[0].slice(1)
        })
        this.getAllData();
    }
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json,
                    searchloading: false
                })
                console.log('friend data', json)
            }).then( () => {
                let first = this.state.friendString.split('-')[0];
                let last = this.state.friendString.split('-')[1];
                let friendFirst = this.state.allData.filter(one => one.firstName === first && one.lastName === last);
                let friendId = friendFirst[0].username;
                let friendData = this.state.allData.filter(one => one.username === friendId);
                this.setState({
                    friendData: friendData
                });
                console.log('friend data parsed', friendData)
            })
    }
    renderReading = () => {
        return this.state.friendData.filter(book => book.status === "Currently-Reading").map((each) => 
        <Col sm={6} key={each.id}  >
            
            <Row>
                <Col xs={7}>
                <div >
                    <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3> 
                </div>
                    <div className="summary-reading">
                        <div >
                            <h4>{each.author}</h4>
                            <a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a>
                        </div>
                            
                        </div>
                </Col>
                <Col xs={5}>
                    <span>
                    {each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i className="fa fa-book" aria-hidden="true"></i>
                    }
                    </span>
                </Col>
                <Col xs={12}>
                <div className="summary-reading">
                    {each.overview && each.overview !== 'null' ? 
                                            <Accordion defaultActiveKey="0">
                                                        <Card>
                                                            <Card.Header>
                                                                <CustomToggle eventKey={each.id}>
                                                                    Summary
                                                                </CustomToggle>
                                                            </Card.Header>
                                                            <Accordion.Collapse eventKey={each.id}>
                                                                <Card.Body><p>{each.overview}</p></Card.Body>
                                                            </Accordion.Collapse>
                                                        </Card>
                                            </Accordion>  
                     : 
                     <p>(No summary available)</p> }
                </div>
                </Col>
            </Row>
        </Col>
        )
    }
    renderFinishedData = () => {
        let twentytwentyBooks = this.state.friendData.filter(one => one.title && one.status === "Finished" && moment(one.date).isBefore('2021-01-01'))
        return twentytwentyBooks.sort((b,a) => new moment(a.date) - new moment(b.date)).map((each) => 
        <Col key={each.id} className="book-card" md={4} sm={6}>
        <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
        <Row>
            <Col xs={8}>
                <h4>{each.author}</h4>
                <p className="card-smaller">{each.status} {moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""} </p>
                <p className="card-smaller">{each.rating} <a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
            </Col>
            <Col xs={4}>
                {each.image && each.image !== 'null' ?
                    <img src={each.image} alt={each.title} />
                    :
                    <i className="fa fa-book" aria-hidden="true"></i>
                }
            </Col>
            
        </Row>
        {each.overview && each.overview !== 'null' ? 
            <Accordion defaultActiveKey="0">
                        <Card>
                            <Card.Header>
                            <CustomToggle eventKey={each.id}>
                                Summary
                            </CustomToggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={each.id}>
                                <Card.Body><p>{each.overview}</p></Card.Body>
                            </Accordion.Collapse>
                        </Card>
            </Accordion>  
            : 
        <p>(No summary available)</p> }
   </Col>
        )
    }
    renderFinishedDatatwentytwentyone = () => {
        let twentytwentyOneBooks = this.state.friendData.filter(one => one.title && one.status === "Finished" && moment(one.date).isSameOrAfter('2021-01-01'))
        return twentytwentyOneBooks.sort((b,a) => new moment(a.date) - new moment(b.date)).map((each) => 
        <Col key={each.id} className="book-card" md={4} sm={6}>
        <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
        <Row>
            <Col xs={8}>
                <h4>{each.author}</h4>
                <p className="card-smaller">{each.status} {moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""} </p>
                <p className="card-smaller">{each.rating} <a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
            </Col>
            <Col xs={4}>
                {each.image && each.image !== 'null' ?
                    <img src={each.image} alt={each.title} />
                    :
                    <i className="fa fa-book" aria-hidden="true"></i>
                }
            </Col>
            
        </Row>
        {each.overview && each.overview !== 'null' ? 
            <Accordion defaultActiveKey="0">
                        <Card>
                            <Card.Header>
                            <CustomToggle eventKey={each.id}>
                                 Summary
                            </CustomToggle>
                            </Card.Header>
                            <Accordion.Collapse eventKey={each.id}>
                                <Card.Body><p>{each.overview}</p></Card.Body>
                            </Accordion.Collapse>
                        </Card>
            </Accordion>  
            : 
        <p>(No summary available)</p> }
   </Col>
        )
    }
    renderWantData = () => {
        return this.state.friendData.filter(one => one.title && one.status === "Want-to-read").map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                        </Col>
                        <Col xs={4}>
                            {each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i className="fa fa-book" aria-hidden="true"></i>
                            }
                            
                        </Col>
                        
                    </Row>
                    {each.overview && each.overview !== 'null' ? 
                        <Accordion defaultActiveKey="0">
                                    <Card>
                                        <Card.Header>
                                        <CustomToggle eventKey={each.id}>
                                            Summary
                                        </CustomToggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={each.id}>
                                            <Card.Body><p>{each.overview}</p></Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                        </Accordion>  
                        : 
                    <p>(No summary available)</p> }
                </Col>
        )
    }
    renderStartedData = () => {
        return this.state.friendData.filter(one => one.title && one.status === "Started").map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                        </Col>
                        <Col xs={4}>
                            {each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i className="fa fa-book" aria-hidden="true"></i>
                            }
                            
                        </Col>
                        
                    </Row>
                    {each.overview && each.overview !== 'null' ? 
                        <Accordion defaultActiveKey="0">
                                    <Card>
                                        <Card.Header>
                                        <CustomToggle eventKey={each.id}>
                                            Summary
                                        </CustomToggle>
                                        </Card.Header>
                                        <Accordion.Collapse eventKey={each.id}>
                                            <Card.Body><p>{each.overview}</p></Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                        </Accordion>  
                        : 
                    <p>(No summary available)</p> }
                </Col>
        )
    }
    render = () => {
    const { friendData, searchloading, firstName} = this.state;
    const allBooks = friendData;
    const bookCount = friendData.length;
    let twentytwentyBooks = friendData.filter(one => one.title && one.status === "Finished" && moment(one.date).isBefore('2021-01-01'));
    let twentytwentyOneBooks = friendData.filter(one => one.title && one.status === "Finished" && moment(one.date).isSameOrAfter('2021-01-01'))
    return(
            <div className="main-body">
                {searchloading && 
                    <div className="progress-infinite">
                        <div className="progress-bar3" >
                        </div>                       
                    </div> 
                }
                {!searchloading &&
                    <div className="find-again">
                        <div>
                            <Link to={'/friendsbooks'}>
                                Find another friend
                            </Link>
                            <div>
                                {bookCount > 1 ?
                                    <h2 id="friend-name">{firstName}'s book list</h2>
                                    :
                                    <h2 id="friend-name">{firstName} has not added anything to their list</h2>
                                }
                            </div>
                        </div>
                    </div>
                }
                <div className="page-nav">
                    <Scrollspy items={ ['currently-reading', 'finished', 'want-to-read'] } currentClassName="is-current">
                        {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 &&
                            <li><a href="#currently-reading">Current ></a></li>
                        }   
                        {bookCount > 1 && allBooks.filter(book => book.status === "Finished").length > 0 &&
                            <li><a href="#finished">Finished ></a></li>
                        }
                        {bookCount > 1 && allBooks.filter(book => book.status === "Want-to-read").length > 0 &&
                            <li><a href="#want-to-read">Book list ></a></li> 
                        }
                        {bookCount > 1 && allBooks.filter(book => book.status === "Started").length > 0 &&
                            <li><a href="#started">Put aside... ></a></li> 
                        }
                    </Scrollspy>
                </div>
                
                {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 && !searchloading &&
                <div className="currently" >
                    <div id="currently-reading">
                    <h2>Currently reading:</h2>
                    <Row className='reading-now'>
                        {this.renderReading()}  
                    </Row>
                    </div>
                </div>
                }
                <div id="booklist">
                    {bookCount > 1 && allBooks.filter(book => book.status === "Finished").length > 0 &&
                        <div id="finished">
                            <h2>Finished books</h2>
                            {twentytwentyOneBooks.length > 0 &&
                                <Row >
                                    {this.renderFinishedDatatwentytwentyone()}
                                </Row>
                            }
                            {twentytwentyBooks.length > 0 &&
                                <Accordion defaultActiveKey="0" id="twentytwenty" >
                                <Card >
                                    <Card.Header>
                                    <CustomToggle eventKey='2020books'>
                                        2020 Books
                                    </CustomToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey='2020books'>
                                        <Card.Body>
                                            <Row >
                                                {this.renderFinishedData()}
                                            </Row>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                </Accordion>  
                            }
                        </div>
                    }
                    {bookCount > 1 && allBooks.filter(book => book.status === "Want-to-read").length > 0 &&
                        <div id="want-to-read">
                            <h2>Books {firstName} wants to read</h2>
                            <Row>
                                {this.renderWantData()}
                            </Row>
                        </div>
                    }
                    {bookCount > 1 && allBooks.filter(book => book.status === "Started").length > 0 &&
                        <div id="started">
                            <h2>Books {firstName} started and put aside for now...</h2>
                            <Row>
                                {this.renderStartedData()}
                            </Row>
                        </div>
                    }

                </div>

            </div>
        )
    }
}

export default FriendData;