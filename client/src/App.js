import './App.css';
import React from 'react'
import {getAllCompanies} from "./core/companies";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import {Container} from "@material-ui/core";
import {signUp, signIn, getCurrentUser} from "./core/auth";
import DocumentList from "./DocumentList";
import Header from "./Header";
import CreateDocument from "./CreateDocument";
import {
    approveDocument,
    approveEconomist,
    approveLawyer,
    getAllDocuments,
    getDocument,
    updateDocumentData
} from "./core/documents";
import Message from "./Message";
import {validateMessage, validateUsername} from "./core/validators";
import {createMessage, getAllMessages} from "./core/messages";
import {io} from "socket.io-client";
import Document from "./Document";
import {getAllVersions} from "./core/versions";
import {getAllRoles} from "./core/roles";
import ArchivedDocumentList from "./ArchivedDocumentList";

const ENDPOINT = "http://localhost:5000";

class App extends React.Component {
    signIn = async (username) => {
        try {
            if (validateUsername(username)) {
                let response = await signIn(username);
                const {access_token} = response;
                await this.setState({access_token: access_token});
                localStorage.setItem("access_token", access_token);
                let socket = io(ENDPOINT);
                await this.switchDisplayedComponent("DocumentList");
                let user = await getCurrentUser(access_token);
                await this.updateDocumentList();
                await this.setState({
                    user: {
                        id: user.id,
                        username: user.username,
                        role_id: user.role_id,
                        company_id: user.company_id,
                    },
                    messages: [],
                    message: null,
                    socket: socket,
                });
                this.configurateSocket(socket, this);
            }
        } catch (e) {
            await this.setState({message: e.message});
        }
    }

    signUp = async (username, role_id, company_id) => {
        try {
            if (validateUsername(username)) {
                let response = await signUp(username, role_id, company_id);
                this.setState({message: response.message});
                await this.switchDisplayedComponent("SignInForm");
            }
        } catch (e) {
            await this.setState({message: e.message});
        }
    }

    sendMessage = async (document_id, company_id, message, receiver_id = undefined) => {
        try {
            if (validateMessage(message)) {
                const {socket, access_token} = this.state;
                await createMessage(access_token, document_id, company_id, message, receiver_id);
                await this.setState({message: "Message sent successfully"});
                socket.emit('message');
            }
        } catch (e) {
            await this.setState({message: e.message});
        }
    }

    logout = async () => {
        const {socket} = this.state;
        socket.disconnect();
        await this.switchDisplayedComponent("SignInForm");
        localStorage.removeItem("access_token");
        await this.setState({
            displayedComponent: null,
            socket: null,
            access_token: null,
            document: null,
            message: null,
            messages: [],
            documents: [],
            user: {
                id: null,
                username: null,
                role_id: null,
                company_id: null,
            },
        })
    }

    updateDocument = async (document_id, data) => {
        try {
            const {access_token, socket} = this.state;
            await updateDocumentData(access_token, document_id, data);
            socket.emit('document_update');
        } catch (e) {
            await this.setState({message: e.message});
        }
    }

    closeMessage = async () => {
        await this.setState({message: null});
    }

    setMessage = async (message) => {
        await this.setState({message: message});
    }

    selectDocument = async (document_id) => {
        try {
            const {access_token, companies} = this.state;
            let document = await getDocument(access_token, document_id);
            let companiesToApprove = [];
            companies.forEach((company) => {
                document.companies.forEach((document_company_id) => {
                    if (company.id === document_company_id)
                        companiesToApprove.push(company);
                });
            });
            document.companies = companiesToApprove;
            let messages = await getAllMessages(access_token, document.id);
            document.versions = await getAllVersions(access_token, document.id);
            await this.setState({
                document: document,
                messages: messages,
            });
            await this.switchDisplayedComponent("Document");
        } catch (e) {
            await this.setState({message: e.message});
        }
    }

    approveDocument = async (document_id) => {
        try {
            const {access_token, document} = this.state;
            let response = await approveDocument(access_token, document_id);
            document.approved = response.approved;
            await this.setState({
                message: "Document is approved",
            });
        } catch (e) {
            await this.setState({message: e.message});
        }
    }

    approveEconomist = async (document_id) => {
        try {
            const {access_token, document} = this.state;
            let response = await approveEconomist(access_token, document_id);
            document.economist_approved = response.economist_approved;
            await this.setState({
                message: "Document is approved",
            });
        } catch (e) {
            await this.setState({message: e.message});
        }
    }

    approveLawyer = async (document_id) => {
        try {
            const {access_token, document} = this.state;
            let response = await approveLawyer(access_token, document_id);
            document.lawyer_approved = response.lawyer_approved;
            await this.setState({
                message: "Document is approved",
            });
        } catch (e) {
            await this.setState({message: e.message});
        }
    }

    renderComponent() {
        switch (this.state.displayedComponent) {
            case "SignInForm":
                return <SignInForm signIn={this.signIn}/>
            case "SignUpForm":
                return <SignUpForm signUp={this.signUp}
                                   roles={this.state.roles}
                                   companies={this.state.companies}/>
            case "DocumentList":
                return <DocumentList selectDocument={this.selectDocument}
                                     documents={this.state.documents}/>
            case "ArchivedDocumentList":
                return <ArchivedDocumentList selectDocument={this.selectDocument}
                                             documents={this.state.documents}/>
            case "Document":
                return <Document updateDocument={this.updateDocument}
                                 roles={this.state.roles}
                                 user={this.state.user}
                                 approveDocument={this.approveDocument}
                                 approveEconomist={this.approveEconomist}
                                 approveLawyer={this.approveLawyer}
                                 companiesToApprove={this.state.document.companies}
                                 document={this.state.document}
                                 messages={this.state.messages}
                                 sendMessage={this.sendMessage}
                                 company_id={this.state.user.company_id}/>
            case "CreateDocument":
                return <CreateDocument company_id={this.state.user.company_id}
                                       companies={this.state.companies}
                                       socket={this.state.socket}
                                       access_token={this.state.access_token}
                                       selectDocument={this.selectDocument}
                                       setMessage={this.setMessage}/>
            default:
                return <SignInForm signIn={this.signIn}/>
        }
    }

    constructor() {
        super();
        this.state = {
            displayedComponent: null,
            access_token: null,
            socket: null,
            document: null,
            message: null,
            messages: [],
            documents: [],
            companies: [],
            roles: [],
            user: {
                id: null,
                username: null,
                company_id: null,
            },
        }
    }

    switchDisplayedComponent = async (component) => {
        await this.setState({displayedComponent: component})
    }

    componentDidMount = async () => {
        try {
            let companies = await getAllCompanies();
            let roles = await getAllRoles();
            await this.setState({companies: companies, roles: roles});
            let access_token = localStorage.getItem("access_token");
            if (access_token) {
                let user = await getCurrentUser(access_token);
                let socket = io(ENDPOINT);
                await this.setState({
                    user: {
                        id: user.id,
                        username: user.username,
                        role_id: user.role_id,
                        company_id: user.company_id,
                    },
                    socket: socket,
                    documents: [],
                    displayedComponent: "DocumentList",
                    access_token: access_token,
                });
                await this.updateDocumentList();
                this.configurateSocket(socket, this);

            }
        } catch (e) {
            await this.setState({displayedComponent: "SignInForm"});
        }
    }

    updateVersionList = async () => {
        const {document, access_token} = this.state;
        document.versions = await getAllVersions(access_token, document.id);
        await this.setState({document: document});
    }

    updateMessageList = async () => {
        const {document, access_token} = this.state;
        await this.setState({messages: await getAllMessages(access_token, document.id)});
    }

    updateDocumentList = async () => {
        let {access_token} = this.state;
        let documents = await getAllDocuments(access_token);
        this.setState({documents: documents});
    }

    configurateSocket = (socket, app) => {
        socket.on('update_version_list', async function () {
            const {document} = app.state;
            if (document) {
                await app.setState({
                    message: "Document was updated. Check version list!",
                });
                await app.updateVersionList();
            }
        });
        socket.on('update_message_list', async function () {
            const {document} = app.state;
            if (document) {
                await app.updateMessageList();
            }
        });
        socket.on('update_document_list', async function () {
            await app.updateDocumentList();
        });
        return socket;
    }

    render() {
        return (
            <div className="wrapper">
                <Header switchDisplayedComponent={this.switchDisplayedComponent}
                        user={this.state.user}
                        roles={this.state.roles}
                        logout={this.logout}/>
                {this.state.message && (<Message message={this.state.message} closeMessage={this.closeMessage}/>)}
                <main>
                    <Container>
                        {this.renderComponent()}
                    </Container>
                </main>
            </div>
        );
    }
}

export default App;