import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Link, withRouter, Redirect} from 'react-router-dom'
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import jwt_decode from 'jwt-decode';
//import { login } from './UserFunctions';
import { login} from "../utils/JWTAuth";


function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" to="/">
      Public Service Inquiry System
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:"",
            password:"",
            errors:{},
            redirectToReferrer: false
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);

    }
    componentDidMount(){
        if(localStorage.access_token){
            this.setState({redirectToReferrer: true})
        }
    }
    onSubmit(){
        const user = {
        email: this.state.email,
        password: this.state.password
        }
        login(user).then(res => {
        if(res){
            console.log(res)
            console.log(jwt_decode(localStorage.access_token))
            this.props.setAuthenticated(true)
            this.setState({redirectToReferrer:true})
        }
        })
    }
    onChange(e){
        this.setState({[e.target.name]: e.target.value})
    }

    render(){
        const { classes } = this.props;
        if (this.state.redirectToReferrer){
            return <Redirect to='/home' />
        }
        return (
            <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Sign in
                </Typography>
                <form className={classes.form} noValidate >
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    onChange = {this.onChange}
                    value = {this.state.email}
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange = {this.onChange}
                    value = {this.state.password}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick = {this.onSubmit}
                >
                    Sign In
                </Button>
                <Grid container>
                    <Grid item xs>
                    <Link to="/" variant="body2">
                        Forgot password?
                    </Link>
                    </Grid>
                    <Grid item>
                    <Link to= "/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                    </Link>
                    </Grid>
                </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
            </Container>
        );
    }

}

export default withStyles(useStyles)(withRouter(Login))


