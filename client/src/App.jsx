import './App.css';
import {useEffect, useState} from 'react'
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import {Container} from "@material-ui/core";
import {ApiService} from "./ApiService";
import DocumentList from "./DocumentList";
import Header from "./Header";
import CreateDocument from "./CreateDocument";
import Message from "./Message";
import {validateMessage, validateUsername} from "./core/validators";
import {io} from "socket.io-client";
import Document from "./Document";
import ArchivedDocumentList from "./ArchivedDocumentList";
import {useDispatch, useSelector} from "react-redux";
import {removeAccessToken, selectAccessToken, setAccessToken} from "./features/access_token/accessTokenSlice";
import {selectUser, setUser} from "./features/user/userSlice";

const ENDPOINT = "http://localhost:5000";

const App = () => {
    const [displayedComponent, setDisplayedComponent] = useState('');
    const [socket, setSocket] = useState(null);
    const [document, setDocument] = useState({});
    const [message, updateMessage] = useState(null);
    const [messages, setMessages] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [roles, setRoles] = useState([]);
    const access_token = useSelector(selectAccessToken);
    const user = useSelector(selectUser);
    const dispatch = useDispatch();

    const signIn = async (username) => {
        try {
            if (validateUsername(username)) {
                let response = await ApiService.signIn(username);
                const {access_token} = response;
                dispatch(setAccessToken(access_token));
                let socket = io(ENDPOINT);
                switchDisplayedComponent("DocumentList");
                let user = await ApiService.getCurrentUser(access_token);
                await updateDocumentList();
                setMessages([]);
                updateMessage(null)
                dispatch(setUser({
                    id: user.id,
                    username: user.username,
                    role_id: user.role_id,
                    company_id: user.company_id,
                }));
                setSocket(socket);
                configurateSocket(socket);
            }
        } catch (e) {
            updateMessage(e.message);
        }
    }

    const signUp = async (username, role_id, company_id) => {
        try {
            if (validateUsername(username)) {
                let {message} = await ApiService.signUp(username, role_id, company_id);
                updateMessage(message);
                switchDisplayedComponent("SignInForm");
            }
        } catch (e) {
            updateMessage(e.message);
        }
    }

    const sendMessage = async (document_id, company_id, message, receiver_id = undefined) => {
        try {
            if (validateMessage(message)) {
                await ApiService.createMessage(access_token, document_id, company_id, message, receiver_id);
                updateMessage("Message sent successfully");
                socket.emit('message');
            }
        } catch (e) {
            updateMessage(e.message);
        }
    }

    const logout = async () => {
        socket.disconnect();
        switchDisplayedComponent("SignInForm");
        dispatch(removeAccessToken());
        dispatch(setUser(null));
    }

    const updateDocument = async (document_id, data) => {
        try {
            await ApiService.updateDocumentData(access_token, document_id, data);
            socket.emit('document_update');
        } catch (e) {
            updateMessage(e.message);
        }
    }

    const closeMessage = () => {
        updateMessage(null);
    }

    const setMessage = (message) => {
        updateMessage(message);
    }

    const selectDocument = async (document_id) => {
        try {
            let response = await ApiService.getDocument(access_token, document_id).then(({approved, id, companies, data, economist_approved, lawyer_approved, title, versions}) => {
                document.approved = approved;
                document.companies = companies;
                document.data = data;
                document.economist_approved = economist_approved;
                document.lawyer_approved = lawyer_approved;
                document.title = title;
                document.versions = versions;
                document.id = id;
                return document;
            });
            let companiesToApprove = [];
            companies.forEach((company) => {
                response.companies.forEach((document_company_id) => {
                    if (company.id === document_company_id)
                        companiesToApprove.push(company);
                });
            });
            response.companies = companiesToApprove;
            let messages = await ApiService.getAllMessages(access_token, response.id);
            response.versions = await ApiService.getAllVersions(access_token, response.id);
            setMessages(messages);
            setDocument(response);
            switchDisplayedComponent("Document");
        } catch (e) {
            updateMessage(e.message);
        }
    }

    const approveDocument = async (document_id) => {
        try {
            let response = await ApiService.approveDocument(access_token, document_id);
            document.approved = response.approved;
            updateMessage("Document is approved");
        } catch (e) {
            updateMessage(e.message);
        }
    }

    const approveEconomist = async (document_id) => {
        try {
            let response = await ApiService.approveEconomist(access_token, document_id);
            document.economist_approved = response.economist_approved;
            updateMessage("Document is approved");
        } catch (e) {
            updateMessage(e.message);
        }
    }

    const approveLawyer = async (document_id) => {
        try {
            let response = await ApiService.approveLawyer(access_token, document_id);
            document.lawyer_approved = response.lawyer_approved;
            updateMessage("Document is approved");
        } catch (e) {
            updateMessage(e.message);
        }
    }

    const renderComponent = () => {
        switch (displayedComponent) {
            case "SignInForm":
                return <SignInForm signIn={signIn}/>
            case "SignUpForm":
                return <SignUpForm signUp={signUp}
                                   roles={roles}
                                   companies={companies}/>
            case "DocumentList":
                return <DocumentList selectDocument={selectDocument}
                                     documents={documents}/>
            case "ArchivedDocumentList":
                return <ArchivedDocumentList selectDocument={selectDocument}
                                             documents={documents}/>
            case "Document":
                return <Document updateDocument={updateDocument}
                                 roles={roles}
                                 user={user}
                                 approveDocument={approveDocument}
                                 approveEconomist={approveEconomist}
                                 approveLawyer={approveLawyer}
                                 companiesToApprove={document.companies}
                                 document={document}
                                 messages={messages}
                                 sendMessage={sendMessage}
                                 company_id={user.company_id}/>
            case "CreateDocument":
                return <CreateDocument company_id={user.company_id}
                                       companies={companies}
                                       socket={socket}
                                       access_token={access_token}
                                       selectDocument={selectDocument}
                                       setMessage={setMessage}/>
            default:
                return <SignInForm signIn={signIn}/>
        }
    }

    const switchDisplayedComponent = (component) => {
        setDisplayedComponent(component);
    }

    useEffect(async () => {
        async function componentDidMount() {
            try {
                let companies_list = await ApiService.getAllCompanies();
                let roles = await ApiService.getAllRoles();
                setRoles(roles);
                companies.push(...companies_list);
                if (access_token) {
                    let user = await ApiService.getCurrentUser(access_token);
                    let socket = io(ENDPOINT);
                    setDocuments([]);
                    setSocket(socket);
                    setDisplayedComponent("DocumentList");
                    dispatch(setUser({
                        id: user.id,
                        username: user.username,
                        role_id: user.role_id,
                        company_id: user.company_id,
                    }));
                    dispatch(setAccessToken(access_token));
                    await updateDocumentList();
                    configurateSocket(socket);
                }
            } catch (e) {
                setDisplayedComponent("SignInForm");
            }
        }
        await componentDidMount().then();
    },  [access_token, dispatch]);

    const updateVersionList = async () => {
        await ApiService.getAllVersions(access_token, document.id).then((versions) => {
            document.versions = versions;
        });
    }

    const updateMessageList = async () => {
        let messages = await ApiService.getAllMessages(access_token, document.id);
        setMessages(messages);
    }

    const updateDocumentList = async () => {
        let documents = await ApiService.getAllDocuments(access_token);
        setDocuments(documents);
    }

    const configurateSocket = (socket) => {
        socket.on('update_version_list', async function () {
            if (document) {
                updateMessage("Document was updated. Check version list!");
                await updateVersionList();
            }
        });
        socket.on('update_message_list', async function () {
            if (document) {
                await updateMessageList();
            }
        });
        socket.on('update_document_list', async function () {
            await updateDocumentList();
        });
    }

    return (
        <div className="wrapper">
            <Header switchDisplayedComponent={switchDisplayedComponent}
                    roles={roles}
                    logout={logout}/>
            {message && (<Message message={message} closeMessage={closeMessage}/>)}
            <main>
                <Container>
                    {renderComponent()}
                </Container>
            </main>
        </div>
    )
}

export default App;