import React, {useRef, useState} from 'react';
import {Button, Typography} from '@material-ui/core/';
import Grid from "@material-ui/core/Grid";
import JoditEditor from "jodit-react";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import {ApiService} from "./ApiService";
import {makeStyles} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import {validateCompaniesCount, validateTitle} from "./core/validators";
import InputLabel from "@material-ui/core/InputLabel";


const useStyles = makeStyles({
    documentTitle: {
        width: "100%",
    },
    pageTitle: {
        textAlign: "center",
    },
    center: {
        display: "block",
        margin: "auto",
    },
});

const CreateDocument = ({selectDocument, socket, company_id, setMessage, access_token, companies}) => {
    const classes = useStyles();

    const editor = useRef(null);
    const [content, setContent] = useState('');
    const [selectedCompanies, setSelectedCompanies] = useState([]);
    const [title, setTitle] = useState('');


    const saveDocument = async () => {
        try {
            if (validateTitle(title) && validateCompaniesCount(selectedCompanies)) {
                let response = await ApiService.createDocument(access_token, title, content, [...selectedCompanies, company_id]);
                selectDocument(response.document_id);
                socket.emit('document_list_update');
            }
        } catch (e) {
            await setMessage(e.message);
        }
    }

    const handleChangeSelectedCompanies = (event) => {
        if (selectedCompanies.length < 2)
            setSelectedCompanies(event.target.value);
    };

    const handleChangeContent = (event) => {
        setContent(event.target.innerHTML);
    };

    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    };

    const config = {
        readonly: false,
    };

    return (
        <div className="form">
            <Grid>
                <Typography
                    className={classes.pageTitle}
                    variant="h1"
                    color="inherit">
                    Create Document
                </Typography>
                <TextField style={{padding: 24}}
                           placeholder="title"
                           className={classes.documentTitle}
                           onChange={handleChangeTitle}
                           value={title}
                />
                <JoditEditor
                    ref={editor}
                    value={content}
                    config={config}
                    tabIndex={1}
                    onBlur={handleChangeContent}
                />
                <InputLabel shrink id="label">Company</InputLabel>
                <Select
                    className={classes.center}
                    labelId="label"
                    id="mutiple-company"
                    multiple
                    value={selectedCompanies}
                    onChange={handleChangeSelectedCompanies}
                    input={<Input id="select-multiple-companies"/>}
                >
                    {companies.map((company) => {
                        if (company.id !== company_id)
                            return (
                                <MenuItem key={company.id} value={company.id}>
                                    {company.name}
                                </MenuItem>
                            )
                    })}
                </Select>
                <Button
                    variant="contained"
                    fullWidth={true}
                    color={"primary"}
                    className={classes.center}
                    onClick={saveDocument}>
                    <Grid container direction={"row"} justify={"center"}>
                        <SaveIcon/>
                        <Typography>Create</Typography>
                    </Grid>
                </Button>
            </Grid>
        </div>
    );
}

export default CreateDocument;
