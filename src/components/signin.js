import React from 'react';


class SignIn extends React.Component {
    constructor(props){
        super(props);
        this.state={
            submitting: false,
            firstName: '',
            lastName: '',
            username: '',
            checkusername: false,
            savedusername: '',
            done: false,
            usernamedone: '',
            usernamefound: false,
            allData: [],
            searchloading: false,
            usernamenotfound: false

        }
    }
    componentDidMount = () => {
        // this.getAllData()
        fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
            })
    }
    getAllData = () => {
        fetch('https://sheet.best/api/sheets/cc3a871c-9365-4594-ab7a-828fcec65219')
            .then( (response) => {
                return response.json()
            }).then( (json) => {
                this.setState({
                    allData: json
                })
            })
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })

    handleSubmit = event => {
        event.preventDefault();
        let allData = this.state.allData;
        this.setState({
            searchloading: true
        })
        for(var i=0; i<allData.length; i++){
            if(allData[i].username === this.state.username){
                this.setState({
                    usernamefound: true
                })
                localStorage.setItem('username', this.state.username);
                this.props.updateNav();
                this.props.showSignin();
            }
            else{
                this.setState({usernamenotfound: true})
            }
        }
        this.setState({
            searchloading: false
        })
    }
    closeSignIn = () => {
        this.props.showSignin();
    }
      render(){
        const { username, usernamedone, savedusername, checkusername, searchloading, done, usernamefound, usernamenotfound} = this.state;
        const submitting = this.state.submitting;
        let pageContent;
        if(checkusername){
            pageContent = 
            <div className="login">
                    <p>Looks like you are already signed in as {savedusername}</p>
                    <p>Not {savedusername} or want to sign up another user? Logout and then login or sign-up.</p>
            </div>
        }else if(done){
            pageContent = 
            <div className="login">
                        <p>Thanks for signing in {usernamedone}</p>         
            </div>
        }else if(usernamefound && !searchloading){
            pageContent = 
            <div className="login">
                        <h3>Welcome back {username}</h3>
                        <p>Use the navigation to view your book list, make updates, add new books.</p>       
            </div>
        }
        else{
            pageContent =
            <div className="login">
            <form onSubmit={this.handleSubmit} className={submitting ? 'loading' : 'submit-form'}>
            <div className="close-button"><button  onClick={this.closeSignIn}>x</button></div>
                <p>
                    <label>Enter your username: <br />
                        <input type="text" name="username" value={username}  onChange={this.handleChange} />
                    </label>
                </p>
                {usernamenotfound &&
                    <p className="error">Username not found. Search again.</p>
                }
                <input type='submit'  disabled={submitting} value='Sign In'></input>
                
            </form>
            
            </div>
        }
        return(
            <div className="main-body">
                {searchloading && 
                    <div className="progress-infinite">
                        <div className="progress-bar3" >
                        </div>                       
                    </div> 
                } 
                <div className="sign-widget">
                    {pageContent} 
                </div>
            </div>    
        )
    }
}

export default SignIn;

