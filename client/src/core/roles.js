const HOST = 'http://localhost:5000';

async function getAllRoles() {
    let response = await fetch(`${HOST}/api/v1/roles/`, {
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

async function getRole(access_token, role_id) {
    let response = await fetch(`${HOST}/api/v1/roles/${role_id}/`, {
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
    getAllRoles,
    getRole,
}