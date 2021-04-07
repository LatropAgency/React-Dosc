import React, {useState} from 'react';
import {Button, TextField, Typography} from '@material-ui/core/';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";


const useStyles = makeStyles({
    form: {
        padding: "10px 20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "10px",
    },
    btn: {
        margin: "0 0 10 0",
    }
});

const SignInForm = ({signIn}) => {
    const classes = useStyles();
    const [username, setUsername] = useState('');

    return (
        <Grid className={classes.form}>
            <Paper className={classes.form}>
                <Typography variant="h3" color="inherit">
                    Sign In Form
                </Typography>
                <TextField style={{padding: 24}}
                           fullWidth={true}
                           placeholder="username"
                           onChange={(e) => setUsername(e.target.value)}
                />
                <Button className={classes.btn} variant="contained"
                        fullWidth={true}
                        color={"primary"}
                        onClick={() => signIn(username)}>
                    Sign In
                </Button>
            </Paper>
        </Grid>
    );
}

export default SignInForm;
