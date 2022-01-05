import React from 'react';

class SignOut extends React.Component {
    constructor(props){
        super(props);
        this.state={
            username: ''
        }

    }
    componentDidMount = () => {
        let username = this.props.username;
        if(username){
            this.setState({
                savedusername: username            })
        }
    }
    handleClear = () => {
        localStorage.clear();
        this.props.updateNav();
        this.props.showSignout();
    }
    closeSignOut = () => {
        this.props.showSignout()
    }
    handleChange = e => this.setState({
        [e.target.name]: e.target.value
    })
    render(){
        let pageContent;
            pageContent = 
            <div className="login">
                <div className="close-button"><button  onClick={this.closeSignOut}>x</button></div>
                <p><strong>Are you sure you want to sign out?</strong></p> 
                <div className="div-button" onClick={this.handleClear}>Sign me out</div>       
            </div>
        return(
            <div className="main-body">
                <div className="sign-widget">
                    {pageContent}
                </div>
            </div>
        )
    }
}

export default SignOut;

