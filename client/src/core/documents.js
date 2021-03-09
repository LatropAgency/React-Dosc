const HOST = 'http://localhost:5000';

async function getAllDocuments(access_token) {
    let response = await fetch(`${HOST}/api/v1/documents/`, {
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

async function getDocument(access_token, document_id) {
    let response = await fetch(`${HOST}/api/v1/documents/${document_id}/`, {
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

async function createDocument(access_token, title, data, companies) {
    let response = await fetch(`${HOST}/api/v1/documents/`, {
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

async function updateDocumentData(access_token, document_id, data) {
    let response = await fetch(`${HOST}/api/v1/documents/${document_id}/`, {
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

async function approveDocument(access_token, document_id) {
    let response = await fetch(`${HOST}/api/v1/documents/${document_id}/approve/`, {
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

async function approveEconomist(access_token, document_id) {
    let response = await fetch(`${HOST}/api/v1/documents/${document_id}/economist_approve/`, {
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

async function approveLawyer(access_token, document_id) {
    let response = await fetch(`${HOST}/api/v1/documents/${document_id}/lawyer_approve/`, {
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


export {
    getAllDocuments,
    createDocument,
    updateDocumentData,
    getDocument,
    approveDocument,
    approveEconomist,
    approveLawyer,
}