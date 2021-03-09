const HOST = 'http://localhost:5000'

async function getAllMessages(access_token, document_id) {
    let response = await fetch(`${HOST}/api/v1/messages/${document_id}/`, {
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

async function createMessage(access_token, document_id, company_id, message, receiver_id = undefined) {
    let response = await fetch(`${HOST}/api/v1/messages/`, {
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

export {
    getAllMessages,
    createMessage,
}