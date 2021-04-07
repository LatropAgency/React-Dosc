import {Button, Typography} from '@material-ui/core/';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";


const Status = ({companies, user, document, roles, company_id, approveDocument, approveLawyer, approveEconomist}) => {

    return (
        <Grid style={{margin: "10px 0", width: "100%"}} container spacing={3}
              justify="space-evenly">
            {companies.map(({id, name}) => {
                return (
                    <Grid key={id} item>
                        <Paper style={{padding: "20px"}}>
                            <Typography style={{textAlign: "center"}} variant={"h4"}>{name}</Typography>
                            <Typography>
                                Economist:
                                {roles.find(role => role.id === user.role_id).name === 'Economist' ? (
                                    document.economist_approved.includes(id) ? "(approved)" : (
                                        company_id === id ? (
                                            <Button
                                                onClick={() => approveEconomist(document.id)}
                                                variant="outlined"
                                                color={"primary"}>
                                                Approve
                                            </Button>
                                        ) : '(not approved)'
                                    )
                                ) : (document.economist_approved.includes(id) ? "(approved)" : '(not approved)')}<br/>
                                Lawyer:
                                {roles.find(role => role.id === user.role_id).name === 'Lawyer' ? (
                                    document.lawyer_approved.includes(id) ? "(approved)" : (
                                        company_id === id ? (
                                            <Button
                                                onClick={() => approveLawyer(document.id)}
                                                variant="outlined"
                                                color={"primary"}>
                                                Approve
                                            </Button>
                                        ) : '(not approved)'
                                    )
                                ) : (document.lawyer_approved.includes(id) ? "(approved)" : '(not approved)')}<br/>
                                Director:
                                {}
                                {roles.find(role => role.id === user.role_id).name === 'Director' ? (
                                    document.approved.includes(id) ? "(approved)" : (
                                        (document.lawyer_approved.includes(id) && document.economist_approved.includes(id) && company_id === id) ? (
                                            <Button
                                                onClick={() => approveDocument(document.id)}
                                                variant="outlined"
                                                color={"primary"}>
                                                Approve
                                            </Button>
                                        ) : '(not approved)'
                                    )
                                ) : (document.approved.includes(id) ? "(approved)" : '(not approved)')}
                            </Typography>
                        </Paper>
                    </Grid>)
            })}
        </Grid>
    );
}

export default Status;
