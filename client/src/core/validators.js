function validateUsername(username) {
    if (!username.match(/^[A-Za-z0-9_]*$/))
        throw new Error("Not allowed username characters: A-Z, a-z, 0-9, _");
    else if (!username.match(/^.{6,}$/))
        throw new Error("Min username length: 6");
    else if (!username.match(/^.{0,16}$/))
        throw new Error("Max username length: 16");
    return true
}

function validateCompaniesCount(companies) {
    if (companies.length < 1)
        throw new Error("Select at least one company");
    return true
}

function validateMessage(message) {
    if (!message.match(/^[A-Za-z0-9_]*$/))
        throw new Error("Not allowed message characters: A-Z, a-z, 0-9, _");
    else if (!message.match(/^.{1,}$/))
        throw new Error("Min message length: 1");
    else if (!message.match(/^.{0,32}$/))
        throw new Error("Max message length: 32");
    return true
}

function validateTitle(title) {
    if (!title.match(/^[A-Za-z0-9_]*$/))
        throw new Error("Not allowed title characters: A-Z, a-z, 0-9, _");
    else if (!title.match(/^.{6,}$/))
        throw new Error("Min title length: 6");
    else if (!title.match(/^.{0,64}$/))
        throw new Error("Max title length: 64");
    return true
}

export {
    validateCompaniesCount,
    validateUsername,
    validateMessage,
    validateTitle,
}