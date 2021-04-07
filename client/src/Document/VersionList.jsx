import {Typography} from '@material-ui/core/';
import Grid from "@material-ui/core/Grid";
import {makeStyles} from '@material-ui/core';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
    versionItem: {
        display: "flex",
        justifyContent: "space-between"
    },
});


const VersionList = ({document, revetVersion}) => {
    const classes = useStyles();

    return (
        <Grid style={{margin: "10px 0"}} container spacing={3}>
            <Grid style={{margin: "auto", width: "100%"}} item>
                <Typography style={{textAlign: "center"}} variant={"h4"}>Versions</Typography>
                <Paper style={{maxHeight: 300, overflow: 'auto'}}>
                    <Grid className={classes.versionItem} style={{padding: "10px 20px 0 20px"}}>
                        <Typography>Version ID</Typography>
                        <Typography>Company</Typography>
                        <Typography>DateTime</Typography>
                    </Grid>
                    <List>
                        {document.versions.map((version) => {
                            return (
                                <ListItem
                                    key={version.id}
                                    className={classes.versionItem}
                                    onClick={(e) => {
                                        revetVersion(version.data)
                                    }}
                                    value={version.id} button>
                                    <Typography>
                                        {version.id}
                                    </Typography>
                                    <Typography>
                                        {document.companies.find(company => company.id === version.company_id).name}
                                    </Typography>
                                    <Typography>
                                        {version.datetime}
                                    </Typography>
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>
            </Grid>
        </Grid>
    );
}

export default VersionList;
