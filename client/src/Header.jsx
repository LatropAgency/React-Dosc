import {Button, Typography} from '@material-ui/core/';
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";
import {makeStyles} from '@material-ui/core';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AddIcon from '@material-ui/icons/Add';
import ListIcon from '@material-ui/icons/List';
import ArchiveIcon from '@material-ui/icons/Archive';
import {useSelector} from "react-redux";
import {selectUser} from "./features/user/userSlice";

const useStyles = makeStyles({
    documentList: {
        textTransform: "uppercase",
    },
    headerTopline: {
        display: "flex",
        justifyContent: "space-between"
    }
});


const Header = ({logout, roles, switchDisplayedComponent}) => {
    const classes = useStyles();
    const user = useSelector(selectUser);

    return (
        <AppBar position="static">
            <Container>
                <Toolbar className={classes.headerTopline}>
                    <Typography variant={"h5"}>
                        ZeslaGroup
                    </Typography>
                    <nav>
                        {user && user.id && (
                            <div>
                                <Button
                                    className={classes.documentList}
                                    color={"inherit"}
                                    onClick={() => switchDisplayedComponent("DocumentList")}>
                                    <ListIcon />
                                    {user.username}({roles.find(role => role.id === user.role_id).name})
                                </Button>
                                <Button
                                    className={classes.documentList}
                                    color={"inherit"}
                                    onClick={() => switchDisplayedComponent("ArchivedDocumentList")}>
                                    <ArchiveIcon />
                                    Archive
                                </Button>
                                <Button
                                    color={"inherit"}
                                    onClick={() => switchDisplayedComponent("CreateDocument")}>
                                    <AddIcon />
                                    Create
                                </Button>
                                <Button color={"inherit"} onClick={logout}>
                                    <ExitToAppIcon />
                                    Logout
                                </Button>
                            </div>
                        )}
                        {!user && (
                            <div>
                                <Button
                                    color={"inherit"}
                                    onClick={() => switchDisplayedComponent("SignInForm")}>
                                    Sign In
                                </Button>
                                <Button
                                    color={"inherit"}
                                    onClick={() => switchDisplayedComponent("SignUpForm")}>
                                    Sign Up
                                </Button>
                            </div>
                        )}
                    </nav>
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Header;
