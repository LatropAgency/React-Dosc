const HOST = 'http://localhost:5000';

async function getAllVersions(access_token, document_id) {
    let response = await fetch(`${HOST}/api/v1/documents/${document_id}/versions/`, {
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

async function getVersion(access_token, version_id) {
    let response = await fetch(`${HOST}/api/v1/versions/${version_id}/`, {
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

export {
    getAllVersions,
    getVersion,
}