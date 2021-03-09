const HOST = 'http://localhost:5000'

async function signUp(username, role_id, company_id) {
    let response = await fetch(`${HOST}/api/v1/signup/`, {
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

async function signIn(username) {
    let response = await fetch(`${HOST}/api/v1/signin/`, {
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

async function getCurrentUser(access_token) {
    let response = await fetch(`${HOST}/api/v1/users/`, {
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
    signUp,
    signIn,
    getCurrentUser,
}