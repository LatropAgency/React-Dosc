import React, {useRef, useState} from 'react';
import {Button, Typography} from '@material-ui/core/';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Status from "./Document/Status";
import MessageList from "./Document/MessageList";
import JoditEditor from "jodit-react";
import SaveIcon from "@material-ui/icons/Save";
import VersionList from "./Document/VersionList";


const useStyles = makeStyles({
    documentTitle: {
        textAlign: "center",
        margin: "10px 0",
    },
});

const Details = ({document, user, roles, sendMessage, messages, updateDocument, approveEconomist, approveLawyer, approveDocument, company_id}) => {
    const [displayedComponent, setDisplayedComponent] = useState("Messages");
    const editor = useRef(null);
    const [content, setContent] = useState(document.data);
    const classes = useStyles();

    const handleChangeContent = (event) => {
        setContent(event.target.innerHTML);
    };

    const config = {
        readonly: false,
    };

    const revetVersion = (data) => {
        setContent(data);
    }

    const handleChangeTab = (event, newValue) => {
        setDisplayedComponent(newValue)
    };

    const renderComponent = () => {
        switch (displayedComponent) {
            case "Messages":
                return <MessageList
                    document_id={document.id}
                    messages={messages}
                    company_id={company_id}
                    sendMessage={sendMessage}
                    companies={document.companies}/>
            case "Status":
                return <Status
                    roles={roles}
                    user={user}
                    companies={document.companies}
                    document={document}
                    company_id={company_id}
                    approveLawyer={approveLawyer}
                    approveEconomist={approveEconomist}
                    approveDocument={approveDocument}/>
            case "Versions":
                return <VersionList
                    revetVersion={revetVersion}
                    document={document}/>
            default:
                return <MessageList
                    document_id={document.id}
                    messages={messages}
                    company_id={company_id}
                    sendMessage={sendMessage}
                    companies={document.companies}/>
        }
    }

    return (
        <div>
            <Grid>
                <Paper>
                    <Tabs
                        variant="fullWidth"
                        value={displayedComponent}
                        onChange={handleChangeTab}
                        indicatorColor="primary"
                        textColor="primary"
                        centered>
                        <Tab label="Status" value={"Status"}/>
                        <Tab label="Messages" value={"Messages"}/>
                        <Tab label="Versions" value={"Versions"}/>
                    </Tabs>
                </Paper>
                <Typography
                    className={classes.documentTitle}
                    variant="h4"
                    color="inherit">
                    {document.title}
                </Typography>
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={handleChangeContent}
                />
                <Button
                    fullWidth={true}
                    variant="contained"
                    color={"primary"}
                    onClick={() => updateDocument(document.id, content)} className={classes.center}>
                    <Grid container direction={"row"} justify={"center"}>
                        <SaveIcon/>
                        <Typography>Save</Typography>
                    </Grid>
                </Button>
                {renderComponent()}
            </Grid>
        </div>
    );
}

export default Details;
