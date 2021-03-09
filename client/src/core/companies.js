const HOST = 'http://localhost:5000'

async function getAllCompanies() {
    let response = await fetch(`${HOST}/api/v1/companies/`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });
    if (response.ok)
        return await response.json();
    else
        throw  new Error("Error");
}

async function getCompany(access_token, company_id) {
    let response = await fetch(`${HOST}/api/v1/companies/${company_id}/`, {
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

export {
    getAllCompanies,
    getCompany,
}