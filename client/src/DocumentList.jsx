import React from 'react'
import {Typography, List, ListItem, ListItemText} from '@material-ui/core/';

const DocumentList = ({documents, selectDocument}) => {
    return (
        <div className="documents">
            <Typography variant="h3" color="inherit">
                <List component="nav" aria-label="documents">
                    {documents.map(({id, title, companies, approved}) => {
                        return ((companies.length !== approved.length) && (
                            <ListItem onClick={() => selectDocument(id)} key={id} value={id} button>
                                <ListItemText primary={`${title} ${approved.length}/${companies.length}`}/>
                            </ListItem>
                        ))
                    })}
                </List>
            </Typography>
        </div>
    );
}

export default DocumentList;
