class ApiService {
    static HOST = `http://0.0.0.0:5000`;

    static async signUp(username, role_id, company_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/signup/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
                role_id: role_id,
                company_id: company_id,
            }),
        });
        if (response.ok)
            return await response.json();
        else {
            let errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    }

    static async signIn(username) {
        let response = await fetch(`${ApiService.HOST}/api/v1/signin/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: username,
            }),
        });
        if (response.ok)
            return await response.json();
        else {
            let errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }
    }

    static async getCurrentUser(access_token) {
        let response = await fetch(`${ApiService.HOST}/api/v1/users/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async getAllCompanies() {
        let response = await fetch(`${ApiService.HOST}/api/v1/companies/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (response.ok)
            return response.json();
        else
            throw  new Error("Error");
    }

    static async getCompany(access_token, company_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/companies/${company_id}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else
            throw  new Error("Error");
    }

    static async getAllDocuments(access_token) {
        let response = await fetch(`${ApiService.HOST}/api/v1/documents/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else
            throw new Error("Error")
    }

    static async getDocument(access_token, document_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/documents/${document_id}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return response.json();
        else
            throw new Error("Error")
    }

    static async createDocument(access_token, title, data, companies) {
        let response = await fetch(`${ApiService.HOST}/api/v1/documents/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify({
                title: title,
                data: data,
                companies: companies,
            }),
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async updateDocumentData(access_token, document_id, data) {
        let response = await fetch(`${ApiService.HOST}/api/v1/documents/${document_id}/`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify({
                data: data,
            }),
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async approveDocument(access_token, document_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/documents/${document_id}/approve/`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async approveEconomist(access_token, document_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/documents/${document_id}/economist_approve/`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async approveLawyer(access_token, document_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/documents/${document_id}/lawyer_approve/`, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async getAllMessages(access_token, document_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/messages/${document_id}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else
            throw new Error("Error")
    }

    static async createMessage(access_token, document_id, company_id, message, receiver_id = undefined) {
        let response = await fetch(`${ApiService.HOST}/api/v1/messages/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
            body: JSON.stringify({
                document_id: document_id,
                company_id: company_id,
                message: message,
                receiver_id: receiver_id,
            }),
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async getAllRoles() {
        let response = await fetch(`${ApiService.HOST}/api/v1/roles/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async getRole(access_token, role_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/roles/${role_id}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async getAllVersions(access_token, document_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/documents/${document_id}/versions/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }

    static async getVersion(access_token, version_id) {
        let response = await fetch(`${ApiService.HOST}/api/v1/versions/${version_id}/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
            },
        });
        if (response.ok)
            return await response.json();
        else {
            throw  new Error("Error");
        }
    }
}

export {ApiService}