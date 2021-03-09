import {Button, Typography} from '@material-ui/core/';
import Grid from "@material-ui/core/Grid";
import {Container} from "@material-ui/core";
import {makeStyles} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles({
    message: {
        margin: "10px 0",
    },
    closeBtn: {
        margin: "0 0 0 10px"
    }
});


const Message = ({message, closeMessage}) => {
    const classes = useStyles();

    return (
        <Container>
            <Grid className={classes.message} container direction={"row"} justify={"center"}>
                <Typography variant="h5">{message}</Typography>
                <Button className={classes.closeBtn} variant={"contained"} color={"primary"} onClick={closeMessage}>
                    <CancelIcon/>
                    close
                </Button>
            </Grid>
        </Container>
    );
}

export default Message;
