import {Button, Typography} from '@material-ui/core/';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core';
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import MessageIcon from "@material-ui/icons/Message";
import React, {useState} from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

const useStyles = makeStyles({
    chatForm: {
        width: "50%",
        margin: "auto",
    },
    message: {
        textAlign: "left",
        display: "block",
    }
});


const MessageList = ({messages, document_id, company_id, sendMessage, companies}) => {
    const classes = useStyles();
    const [message, setMessage] = useState('');
    const [receiver, setReceiver] = useState(undefined);


    const handleChangeMessage = (event) => {
        setMessage(event.target.value);
    };

    const handleChangeReceiver = (event) => {
        setReceiver(event.target.value);
    };

    return (
        <Grid style={{margin: "10px 0"}} container spacing={3}>
            <Grid className={classes.chatForm} item>
                <Typography style={{textAlign: "center"}} variant={"h4"}>Messages</Typography>
                <Paper style={{maxHeight: 300, overflow: 'auto'}}>
                    <List>
                        {messages.map((message) => {
                            if ((message.receiver_id === null) || (message.receiver_id === company_id || message.company_id === company_id))
                                return (
                                    <ListItem key={message.id}>
                                        <Typography className={classes.message}>
                                            [{(companies.find(company => company.id === message.company_id).name)}
                                            {message.receiver_id ? '->' + (companies.find(company => company.id === message.receiver_id).name) : ''}]:
                                            {message.message}
                                        </Typography>
                                    </ListItem>
                                )
                        })}
                    </List>
                </Paper>
                <Select fullWidth={true}
                        labelId="label"
                        style={{marginBottom: "10px", padding: "10px"}}
                        defaultValue={companies[0].id}
                        onChange={handleChangeReceiver}
                        value={receiver}>
                    {companies.map(({id, name}) => {
                        if (id !== company_id)
                            return (<MenuItem value={id} key={id}>{name}</MenuItem>)
                    })}
                </Select>
                <Grid container alignItems={"center"} direction={"row"}>
                    <Grid style={{flexGrow: 1}} item>
                        <TextField
                            value={message}
                            fullWidth={true}
                            style={{
                                padding: 24,
                            }}
                            placeholder="message"
                            onChange={handleChangeMessage}/>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color={"primary"}
                            style={{flexGrow: 0}}
                            onClick={() => {
                                sendMessage(document_id, company_id, message, receiver);
                                setMessage('');
                                setReceiver(null);
                            }}>
                            <MessageIcon/>
                            Send
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default MessageList;
