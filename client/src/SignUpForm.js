import React, {useState} from 'react'
import {Button, TextField, Typography} from '@material-ui/core/';
import {makeStyles} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";

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

const SignUpForm = ({signUp, companies, roles}) => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [companyId, setCompanyId] = useState(companies[0]);
    const [roleId, setRoleId] = useState(roles[0]);

    return (
        <Grid className={classes.form}>
            <Paper className={classes.form}>
                <Typography variant="h3" color="inherit">Sign Up Form</Typography>
                <TextField style={{padding: 24}}
                           fullWidth={true}
                           placeholder="username"
                           onChange={(e) => {
                               setUsername(e.target.value);
                           }}
                />
                <InputLabel shrink id="company">Company</InputLabel>
                <Select fullWidth={true}
                        labelId="company"
                        style={{marginBottom: "10px"}}
                        onChange={(e) => {
                            setCompanyId(e.target.value);
                        }}
                        defaultValue={companies[0].id}
                        value={companyId}>
                    {companies.map(({id, name}) => {
                        return (<MenuItem value={id} key={id}>{name}</MenuItem>)
                    })}
                </Select>
                <InputLabel shrink id="role">Role</InputLabel>
                <Select fullWidth={true}
                        labelId="role"
                        style={{marginBottom: "10px"}}
                        onChange={(e) => {
                            setRoleId(e.target.value);
                        }}
                        defaultValue={roles[0].id}
                        value={roleId}>
                    {roles.map(({id, name}) => {
                        return (<MenuItem value={id} key={id}>{name}</MenuItem>)
                    })}
                </Select>
                <Button className={classes.btn} variant="contained"
                        color={"primary"}
                        fullWidth={true}
                        onClick={() => {
                            signUp(username, roleId, companyId)
                        }}>
                    Sign Up
                </Button>
            </Paper>

        </Grid>
    );
}

export default SignUpForm;
