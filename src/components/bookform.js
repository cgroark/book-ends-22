import React from 'react';
import { Row, Col, Accordion, Card, Button, AccordionContext, useAccordionButton  } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import moment from 'moment';
import Scrollspy from 'react-scrollspy';
import "react-datepicker/dist/react-datepicker.css";
// require('dotenv').config();
// const sheetKey = process.env.REACT_APP_API_KEY;

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

class BookForm extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: '',
            allData: [],
            submitting: false,
            author: '', 
            title: '', 
            status: '', 
            format: '',
            rating: '',
            bookid: '',
            comment: 'null',
            editing: false,
            adding: false,
            form: false,
            currentID: '',
            date: moment().toDate(),
            checking: false,
            query: '',
            searchData: [],
            searchComplete: false,
            searchForm: false,
            searchError: false,
            books: true,
            description: 'null',
            imageUrl: 'null',
            searchloading: true,
            currentlyReading: true,
            searchButton: false,
            googleAPIData: [],
            sortedData : [],
            firstName: '',
            lastName: '',
            requiredStatus: false,
            requiredAuthor: false,
            requiredTitle: false,
            completeAdd: false,
            tempTitle: '',
            completeEdit: false
        }

    }
    componentDidMount =() => {
        this.props.pathname(window.location.pathname)
        let usernameProps = this.props.name;
        let usernameData = localStorage.getItem('username');
        if(usernameProps){
            this.setState({
                savedusername: usernameProps,
                checkusername: true,
                username: usernameProps
            })
            this.updatedGoogleAPI();
            
        }
        else if(usernameData){
            this.setState({
                savedusername: usernameData,
                checkusername: true,
                username: usernameData
            })
            this.updatedGoogleAPI();
        }        
    }

    sortData = () =>{
        const allDataSorted = [];
        for(let i=1; i<this.state.googleAPIData.values.length; i++){
            allDataSorted.push({
                firstName: this.state.googleAPIData.values[i][0],           
                lastName: this.state.googleAPIData.values[i][1],       
                username: this.state.googleAPIData.values[i][2],             
                id: this.state.googleAPIData.values[i][3],              
                title: this.state.googleAPIData.values[i][4],                 
                author: this.state.googleAPIData.values[i][5],          
                date: this.state.googleAPIData.values[i][6],              
                status: this.state.googleAPIData.values[i][7],            
                rating: this.state.googleAPIData.values[i][8],              
                overview: this.state.googleAPIData.values[i][9],               
                image: this.state.googleAPIData.values[i][10],                
                format: this.state.googleAPIData.values[i][11],
                comment: this.state.googleAPIData.values[i][13],
            })
        }
        this.setState({
            sortedData: allDataSorted
        });
    }
    updatedGoogleAPI = () => {
        fetch('https://sheets.googleapis.com/v4/spreadsheets/1nXgoXOrplAx-Yx_N-pH6zFBvDYQFzmmD85oDBgSnSRc/values/Sheet1?alt=json&key=AIzaSyDu-1vUJrr_H9DgTcooDlENcvqjQ5WoIqQ')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    googleAPIData: json
                });
                this.sortData();
            }).then( () => {
                let userData = this.state.sortedData.filter(one => one.username === this.state.username);
                if(userData.length === 0){
                    this.setState({currentID: 1});
                }else{
                    let allIDs =[];
                    let userIDsReal = userData.filter(each => each.id !== 'null')
                    for(var b=0 ; b<userIDsReal.length ; b++){
                        if(!isNaN(parseInt(userIDsReal[b].id.split('id=')[1]))){
                            allIDs.push(parseInt(userIDsReal[b].id.split('id=')[1]));
                        }
                    }
                    let sortedIDs= allIDs.sort((b, a) => b - a);
                    let newID = sortedIDs[allIDs.length -1] + 1;
                    this.setState({currentID: newID})
                }       
            }).then( () => {
                this.setState({
                    searchloading: false,
                    searchButton: true
                });
            })
    }
    handleSearch = (e) =>{
        e.preventDefault()
        this.setState({
            searchloading: true,
            searchError: false,
            searchForm: false
        })
        fetch('https://www.googleapis.com/books/v1/volumes?q="'+this.state.query+'"')
        .then( (response) => {
            return response.json()
        }).then( (json) => {
            if(json.totalItems > 0){
                this.setState({
                    searchData: json.items, 
                    searchComplete: true,
                    searchloading: false
                })
            }else{
                this.setState({
                    query: '',
                    searchError: true,
                    searchForm: true,
                    searchloading: false
                })
                return json;
            }
           
        })
    }
    showSearchForm = () =>{
        this.setState({
            currentlyReading: false,
            searchButton: false,
            books: false,
            searchForm: true,
            author: '', 
            title: '', 
            status: 'select-status', 
            format: 'select-format', 
            rating: 'select-rating', 
            date: moment().toDate(),
            comment: '',
            completeAdd: false,
            completeEdit: false
        })
    }
    addSearchResults = (title, author, description, image, e) => {
        let imageAdd;
        if(image){
            imageAdd = image;
        }else{
            imageAdd = 'null'
        }
        let descriptionAdd;
        if(description){
            descriptionAdd = description;
        }else{
            descriptionAdd = 'null'
        }
        let currentDate = moment().toDate();
        e.preventDefault();
        this.setState({
            searchComplete: false,
            searchForm: false,
            query: '',
            adding: true,
            form: true,
            title: title,
            author: author[0],
            description: descriptionAdd, 
            imageUrl: imageAdd,
            rating: 'select-rating',
            date: currentDate
        })
    }
    searchAgain = () => {
        this.setState({
            searchForm: true,
            searchComplete: false,
            query: ''
        })
    }
    showAddForm = () =>{
        this.setState({
            adding: true,
            searchComplete: false,
            searchForm: false,
            form: true,
            completeAdd: false,
            completeEdit: false
        })
    }
    handleSubmit = event => {
        if(this.state.comment === ''){
            this.setState({
                comment: 'null'
            })
        }
        if(this.state.status === 'select-status' || this.state.title === '' || this.state.author === '' ){
            event.preventDefault()
            if(this.state.status === 'select-status'){
                this.setState({
                    requiredStatus: true
                })
            }
            if(this.state.title === ''){
                this.setState({
                    requiredTitle: true
                })
            }
            if(this.state.author === ''){
                this.setState({
                    requiredAuthor: true
                })
            }
        }else{
            const dataSend = {
                firstName: 'null',
                lastName: 'null',
                date: this.state.date,
                author: this.state.author,
                username: this.state.username,
                title: this.state.title,
                status: this.state.status,
                format: this.state.format,
                id: this.state.username+'id='+this.state.currentID,
                rating: this.state.rating,
                overview: this.state.description,
                image: this.state.imageUrl,
                friends: 'null',
                comment: this.state.comment
             }
        event.preventDefault()
        this.setState({
            searchloading: true,
            form: false,
        })
        fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(dataSend)
        }).then( (response) => {
            let tempTitle = this.state.title;
            this.setState({
                searchloading: false,
                author: '', 
                status: 'select-status', 
                format: 'select-format', 
                rating: 'select-rating', 
                date: moment().toDate(),
                description: 'null',
                imageUrl: 'null',
                adding: false,
                books: true, 
                editing: false,
                currentlyReading: true,
                searchButton: true,
                requiredStatus: false,
                tempTitle: tempTitle,
                title: '', 
                comment: 'null',
                completeAdd: true
            })
            this.updatedGoogleAPI();
            return response.json()  
        });
    }
    }
    updateBook = (each, e) =>{  
        var updateRating = each.rating === 'select-rating' ? 'select-rating' : each.rating;
        var dateUpdating = each.status === 'Finished' ? moment(each.date).toDate() : moment().toDate();
        this.setState({
            books: false,
            currentlyReading: false,
            editing: true,
            form: true,
            searchButton: false,
            tempTitle: '',
            completeAdd: false,
            completeEdit: false
        })
        this.setState({
            date: dateUpdating,
            author: each.author,
            title: each.title, 
            status: each.status, 
            format: each.format,
            rating: updateRating,
            bookid: each.id,
            comment: each.comment
        })
    }
    handleSubmitEdit = event => {
        let tempTitle = this.state.title;
        if(this.state.status === 'select-status' || this.state.title === '' || this.state.author === '' ){
            event.preventDefault()
            if(this.state.status === 'select-status'){
                this.setState({
                    requiredStatus: true
                })
            }
            if(this.state.title === ''){
                this.setState({
                    requiredTitle: true
                })
            }
            if(this.state.author === ''){
                this.setState({
                    requiredAuthor: true
                })
            }
            
        }else{
            this.setState({
                tempTitle: tempTitle
            })
            const dataEdit = {
                author: this.state.author,
                title: this.state.title,
                rating: this.state.rating,
                status: this.state.status,
                format: this.state.format,
                date: this.state.date,
                comment: this.state.comment
            }
            event.preventDefault()
            this.setState({
                searchloading: true,
                form: false
            })
            fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219/id/'+this.state.bookid, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: 'PATCH',
                body: JSON.stringify(dataEdit)
            }).then( (response) => {
                this.setState({
                    author: '', 
                    title: '', 
                    status: 'select-status', 
                    format: 'select-format', 
                    rating: 'select-rating', 
                    comment: 'null',
                    date: moment().toDate(),
                    editing: false
                })
            }).then( () =>{
                this.updatedGoogleAPI();
                this.setState({
                    books: true,
                    searchloading: false,
                    currentlyReading: true,
                    searchButton: true, 
                    requiredStatus: false,
                    completeEdit: true
                })
            })
        }    
    }
    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
        if(this.state.status !== ''){
            this.setState({
                requiredStatus: false
            })
        }
        if(this.state.title !== ''){
            this.setState({
                requiredTitle: false
            })
        }
        if(this.state.author !== ''){
            this.setState({
                requiredAuthor: false
            })
        }
    }
    handleDateChange = date => {
        if(moment(date).isValid()){
            this.setState({date: date})
        }
    }
    updateStatus = e => {
        this.setState({
            status: e.target.value,
            required: false
        })
    }
    updateFormat = e => {
        this.setState({
            format: e.target.value
        })
    }
    updateRating = (e) => {
        this.setState({
            rating: e.target.value
        })
    }
    updateComment = (e) => {
        if(e.target.value === ''){
            this.setState({
                comment: 'null'
            })
        }else{
            this.setState({
                comment: e.target.value
            })
        }
    }
    checkDelete = (e)=> {
        e.preventDefault();
        this.setState({
            checking: true
        })
    }    
    handleDeleteYes = (e) =>{
        e.preventDefault();
        this.setState({
            searchloading: true,
            checking: false,
            form: false,
            editing: false
        })
        fetch("https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219/id/"+this.state.bookid, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'DELETE'  
        }).then( (response) => {
            setTimeout(() =>{
                    this.updatedGoogleAPI();
                    this.setState({
                        searchloading: false,
                        books:true, 
                        searchButton: true,
                        currentlyReading: true
                    })
            }, 1000);
        });
       
    }
    handleDeleteNo = () => {
        this.setState({checking: false})
    }
    removeForm = () => {
        this.setState({
            searchForm: false,
            form: false,
            books: true,
            searchComplete: false,
            query: '',
            adding: false,
            author: '',
            title: '', 
            status: 'select-status', 
            format: 'select-format', 
            rating: 'select-rating', 
            imageUrl: 'null',
            description: 'null',
            date: moment().toDate(),
            editing: false,
            currentlyReading: true,
            searchButton: true,
            checking: false,
            required: false,
            requiredTitle: false,
            requiredAuthor: false,
            requiredStatus: false
        })
    }
    renderSearchData(){
        let submitting = this.state.submitting;
        let bookData = this.state.searchData;
        return this.state.searchData.map((each) => 
            <Col key={bookData.id} sm={6}>
            <div className="eachbook">
                <Row>
                    <Col  xs={7}>
                        <p><strong>{each.volumeInfo.title}<em>{each.volumeInfo.subtitle ? ', '+each.volumeInfo.subtitle : '' }</em></strong></p>
                        <p>{each.volumeInfo.authors}</p>
                    
                    </Col>
                    <Col  xs={5}>
                        <p>{each.volumeInfo.imageLinks ? <img src={each.volumeInfo.imageLinks ? 'https'+ each.volumeInfo.imageLinks.thumbnail.slice(4) : ''} alt={each.volumeInfo.title} /> : '' }</p>
                        
                    </Col> 
                    <Col  xs={12}>
                        <Accordion defaultActiveKey="0">
                                <Card>
                                    <Card.Header>
                                        <CustomToggle as={Button} variant="link" eventKey="1">
                                            Overview (see details)
                                        </CustomToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body><p>{each.volumeInfo.description}</p></Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                        </Accordion>  
                    </Col>
                    <input type='submit' className="add-button search" disabled={submitting} onClick={(e) =>this.addSearchResults(each.volumeInfo.title, each.volumeInfo.authors, each.volumeInfo.description, each.volumeInfo.imageLinks ? 'https'+ each.volumeInfo.imageLinks.thumbnail.slice(4) : '', e)} value={submitting ? 'Loading...' : 'Add '+each.volumeInfo.title}></input>
                </Row> 
            </div>
            </Col>
        )
        
              
            
    }
    renderReading(){
        return this.state.sortedData.filter(book => book.username === this.state.username && book.status === "Currently-Reading").map((each) => 
          <Col sm={6} key={each.id}  >
             
              <Row>
                <Col  xs={7}>
                <div>
                    <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3> 
                </div>
                <div >
                    <h4>{each.author}</h4>
                </div>
                {each.comment !== 'null' &&
                                <Accordion defaultActiveKey="0">
                                        <Card>
                                            <Card.Header>
                                                <CustomToggle eventKey={each.id}>
                                                    Comments
                                                </CustomToggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={each.id}>
                                                <Card.Body><p>{each.comment}</p></Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                </Accordion>  
                            }
                    {!this.state.form &&
                        <div>
                            <label htmlFor="edit"></label>
                            <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                        </div>
                    }
                    
                </Col>
                <Col xs={5}>
                    <span>{each.image && each.image !== 'null' ?
                                <img src={each.image} alt={each.title} />
                                :
                                <i className="fa fa-book" aria-hidden="true"></i>
                            }
                    </span>
                </Col>
                </Row>
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
        )
    }
    renderCurrentYearFinished(){
        let currentYearFinished = this.state.sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Finished" && moment(one.date).isSameOrAfter('2022-01-01'))
        return currentYearFinished.sort((b,a) => new moment(a.date) - new moment(b.date)).map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller">{each.status} {moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""} </p>
                            <p className="card-smaller">{each.rating === 'select-rating' ? '' : each.rating} </p>
                            {each.comment !== 'null' &&
                                <Accordion defaultActiveKey="0">
                                        <Card>
                                            <Card.Header>
                                                <CustomToggle eventKey={each.id}>
                                                    Comments
                                                </CustomToggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={each.id}>
                                                <Card.Body><p>{each.comment}</p></Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                </Accordion>  
                            }
                            {!this.state.form &&
                                <div>
                                    <label htmlFor="edit"></label>
                                    <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                                </div>
                            }
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
    renderFinishedDataTwentyTwenty(){
        let twentytwentyBooks = this.state.sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Finished" && moment(one.date).isBefore('2021-01-01'))
        return twentytwentyBooks.sort((b,a) => new moment(a.date) - new moment(b.date)).map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller">{each.status} {moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""} </p>
                            <p className="card-smaller">{each.rating === 'select-rating' ? '' : each.rating} </p>
                            {each.comment !== 'null' &&
                                <Accordion defaultActiveKey="0">
                                        <Card>
                                            <Card.Header>
                                                <CustomToggle eventKey={each.id}>
                                                    Comments
                                                </CustomToggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={each.id}>
                                                <Card.Body><p>{each.comment}</p></Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                </Accordion>  
                            }
                            {!this.state.form &&
                                <div>
                                    <label htmlFor="edit"></label>
                                    <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                                </div>
                            }
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
    renderFinishedDatatwentytwentyone(){
        let twentytwentyOneBooks = this.state.sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Finished" && moment(one.date).isBetween('2021-01-01', '2021-12-31'))
        return twentytwentyOneBooks.sort((b,a) => new moment(a.date) - new moment(b.date)).map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller">{each.status} {moment(each.date).isValid() ? moment(each.date).format('MMM D YYYY'): ""} </p>
                            <p className="card-smaller">{each.rating === 'select-rating' ? '' : each.rating} </p>
                            {each.comment !== 'null' &&
                                <Accordion defaultActiveKey="0">
                                        <Card>
                                            <Card.Header>
                                                <CustomToggle eventKey={each.id}>
                                                    Comments
                                                </CustomToggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={each.id}>
                                                <Card.Body><p>{each.comment}</p></Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                </Accordion>  
                            }
                            {!this.state.form &&
                                <div>
                                    <label htmlFor="edit"></label>
                                    <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                                </div>
                            }
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
    renderWantData(){
        return this.state.sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Want-to-read").map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                            {!this.state.form &&
                                <div>
                                    <label htmlFor="edit"></label>
                                    <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                                </div>
                            }
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
    renderStarted(){
        return this.state.sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Started").map((each) => 
                <Col key={each.id} className="book-card" md={4} sm={6}>
                     <h3><em>{each.title}</em>&nbsp;{each.format === 'Audio' ? <i className="fa fa-headphones" aria-hidden="true"></i> : <i className="fa fa-book" aria-hidden="true"></i>}</h3>
                    <Row>
                        <Col xs={8}>
                            <h4>{each.author}</h4>
                            <p className="card-smaller"><a className="thrift-link" href={"https://www.thriftbooks.com/browse/?b.search="+each.title+' ' +each.author} target="_blank" rel="noopener noreferrer"><i className="fa fa-shopping-cart" aria-hidden="true"></i></a></p>
                            {!this.state.form &&
                                <div>
                                    <label htmlFor="edit"></label>
                                    <input type="submit" value="Update" id="edit" onClick={(e) => this.updateBook(each,e)}></input>
                                </div>
                            }
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
    removeCompleteAdd = () => {
        this.setState({
            completeAdd: false,
            completeEdit: false
        })
    }
    renderCompleteAdd = () => {
        return <div >
            <div className="close-button"><button  onClick={this.removeCompleteAdd}>x</button></div>
            <h4>You've just {this.state.completeAdd ? 'added' : 'updated'} <em><strong>{this.state.tempTitle}</strong></em></h4>
        </div>
        
    }
  
    render(){
    const { completeAdd, completeEdit, format, checking, submitting, author, title, status, sortedData, date, query, rating, comment, searchComplete, searchError, searchForm, searchloading, form, books, currentlyReading, searchButton} = this.state;
    const allBooks = sortedData.filter(book => book.username === this.state.username)
    const bookCount = sortedData.filter(book => book.username === this.state.username).length;
    let currentyearBooks = sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Finished" && moment(one.date).isSameOrAfter('2022-01-01'));
    let twentytwentyBooks = sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Finished" && moment(one.date).isBefore('2021-01-01'));
    let twentytwentyOneBooks = sortedData.filter(one => one.username === this.state.username && one.title && one.status === "Finished" && moment(one.date).isBetween('2021-01-01', '2021-12-31'))
        return(
            <div className="main-body">
                {searchButton &&
                <div className="main-top-section">
                    <h1>Your books</h1>
                    <p>Track your recent reads and search for new books.</p>
                </div>
                }
                {searchButton &&
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
                            <li><a href="#started">Put aside ></a></li> 
                        }
                    </Scrollspy>
                </div>
                }
                {searchButton && 
                    <div>
                        <input type='submit' className="add-button" value="Find a book" onClick={this.showSearchForm}></input>
                    </div>
                }
               
                   <div  id="complete-book" className={completeAdd || completeEdit ? 'show' : 'render'}>
                        {this.renderCompleteAdd()}
                   </div>
                
                {bookCount > 1 && allBooks.filter(book => book.status === "Currently-Reading").length > 0 && currentlyReading && 
                    <div id="currently-reading">
                     <h2>Currently reading</h2>
                     <Row  className='reading-now'>
                      {this.renderReading()}
                    </Row>
                    </div>
                }
              
                {searchloading && 
                    <div className="progress-infinite">
                        <div className="progress-bar3" >
                        </div>                       
                    </div> 
                }
                {!books && !searchloading && !form &&
                    <div>
                        {!searchComplete &&
                         <div>
                             <h2>Search for books below</h2>
                            <p>Find books and add them to your booklist below</p>
                        </div>
                        }
                        
                        <div className="close-button"><button  onClick={this.removeForm}>x</button>
                        </div>
                    </div>
                }
                {searchError &&
                        <div>
                           <p><strong>Looks like we can't find that book. Search again below!</strong></p>
                        </div>
                }
                {!searchComplete && searchForm &&
                    <div>
                       
                        <form onSubmit={this.handleSearch} className={submitting ? 'loading' : 'search-form'}>
                            <input placeholder="Search for books by title..." type="text" name='query' value={query} onChange={this.handleChange} />
                            <input type='submit' value="Search"></input>
                        </form>
                        <input className="manual" type='submit'  onClick={this.showAddForm} disabled={submitting} value='Manually enter a book'></input>
                    </div>
                   
                }
              
                {searchComplete &&
                    <div id="search-results">
                         <div className="search-bar">
                             <input  type='submit' onClick={this.searchAgain}  value='Search again'></input>
                            <input  type='submit'  onClick={this.removeForm}  value='Back to my books'></input>
                         </div>
                         <Row>
                        {this.renderSearchData()}
                        </Row>
                    </div>
                }

                {form && 
                    <div>
                    <form onSubmit={this.state.adding ? this.handleSubmit : this.handleSubmitEdit} className='submit-form'>
                    <div id="close-form"><button  onClick={this.removeForm}>x</button></div>
                        {!checking &&
                        <div>
                        <Row>
                            <Col md={4}>
                                <label >Title:<br />
                                {this.state.requiredTitle &&
                                        <span className="required">This is required</span>
                                    }
                                    <input type="text" name='title' value={title} onChange={this.handleChange} />
                                </label>
                            </Col>
                            <Col md={4}>
                                <label >Author:<br />
                                {this.state.requiredAuthor &&
                                        <span className="required">This is required</span>
                                    }
                                    <input type="text" name='author' value={author} onChange={this.handleChange} /> 
                                </label>
                            </Col>
                            <Col md={4}>
                                    <label>Format: <br />
                                    <select defaultValue={format} onChange={this.updateFormat}>
                                        <option value="select-format" disabled>Select format</option>
                                        <option value="Audio">Audio</option>
                                        <option value="Text">Text</option>
                                    </select>
                                </label>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={4}>
                                <label>Status*:  <br />
                                    {this.state.requiredStatus &&
                                        <span className="required">This is required</span>
                                    }
                                    <select required defaultValue={status} onChange={this.updateStatus}>
                                        <option value="select-status" disabled>Select status</option>
                                        <option value="Finished">Finished</option>
                                        <option value="Currently-Reading">Currently reading</option>
                                        <option value="Want-to-read">Want to read</option>
                                        <option value="Started">Set aside...</option>
                                    </select>
                                </label>
                            </Col>
                            {status === "Finished" &&
                            <React.Fragment>
                            <Col md={4}>
                                <label>Recommendation: <br />
                                    <select defaultValue={rating} onChange={this.updateRating}>
                                        <option value="select-rating" disabled>Select rating</option>
                                        <option value="Highly Recommend">Highly recommend</option>
                                        <option value="Recommend">Recommend</option>
                                        <option value="Do Not Recommend">Don't recommend</option>
                                        <option value="Do Not Read">Please do not read</option>
                                    </select>
                                </label>
                            </Col>
                            <Col md={4}>
                                <label >Finished on:</label><br />
                                <DatePicker selected={date} onChange={this.handleDateChange}  />                                
                            </Col>
                            <Row>
                                <Col md={12}>
                                    <label>Comments: <br />
                                        <textarea  value={comment === 'null' ? '' : comment} onChange={this.updateComment} />
                                    </label>
                                </Col>
                            </Row>
                            </React.Fragment>
                            }
                            
                        </Row>
                        </div>
                        }
                         {!checking &&
                            <div id="input-section">
                                <input type='submit'  value={this.state.adding ? 'Add Book' : 'Update Book'}></input>
                                {this.state.editing && this.state.form &&
                                    <input className="delete" type='submit' onClick={this.checkDelete} value='Delete book'></input>
                                }
                            </div>
                         }
                            {checking &&
                            <div id="delete-section">
                                <div>
                                    <h3>Are you sure you want to delete {title} from your list?</h3>
                                    <label htmlFor="delete-yes"></label>
                                    <input className="delete check" type="submit" value="Yes" id="delete-yes" onClick={this.handleDeleteYes}></input>
                                    <label htmlFor="delete-no"></label>
                                    <input className="delete check" type="submit" value="No" id="delete-no" onClick={this.handleDeleteNo}></input>
                                </div>
                            </div>
                            }
                        
                    </form>   
                    </div>
                }
                {books && bookCount > 1 &&
                    
                    <div id="booklist">
                     {bookCount > 1 && allBooks.filter(book => book.status === "Finished").length > 0 &&
                        <div id="finished">
                            <h2>Finished books</h2>
                            {currentyearBooks.length > 0 &&
                                <Row >
                                    {this.renderCurrentYearFinished()}
                                </Row>
                            }
                            {twentytwentyOneBooks.length > 0 &&
                                <Accordion defaultActiveKey="0" className="past-year-books" id="twentytwentyone" >
                                <Card >
                                    <Card.Header>
                                        <CustomToggle eventKey='2021books'>
                                            2021 Books
                                        </CustomToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey='2021books'>
                                        <Card.Body>
                                            <Row >
                                            {this.renderFinishedDatatwentytwentyone()}
                                            </Row>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                </Accordion>  
                            }
                            {twentytwentyBooks.length > 0 &&
                                <Accordion defaultActiveKey="0" className="past-year-books" id="twentytwenty" >
                                <Card >
                                    <Card.Header>
                                        <CustomToggle eventKey='2020books'>
                                            2020 Books
                                        </CustomToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey='2020books'>
                                        <Card.Body>
                                            <Row >
                                                {this.renderFinishedDataTwentyTwenty()}
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
                            <h2 >Books I want to read</h2>
                            <Row>
                                {this.renderWantData()}
                            </Row>
                        </div>
                     }
                     {bookCount > 1 && allBooks.filter(book => book.status === "Started").length > 0 &&
                        <div id="started">
                            <h2 >Books I put aside for now...</h2>
                            <Row>
                                {this.renderStarted()}
                            </Row>
                        </div>
                     }
                    
                    </div>
                }
            </div>
        )
    }
}

export default BookForm;

