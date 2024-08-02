/**

    Barbequery - a lightweight easy to use DOM library
    All code written by Vexcess available under the MIT license (https://opensource.org/license/mit/)

    TODO:
        - implement logical query operators
        - implement server side rendering???
**/

const fs = require("fs");
const crypto = require("node:crypto");
const Crypto_AES = require("crypto-js/aes");
const Crypto_SHA256 = require("crypto-js/sha256");
const Crypto_Base64 = require("crypto-js/enc-base64");
const Crypto_Utf8 = require("crypto-js/enc-utf8");
const $ = require("./barbequery");

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const numbers = "0123456789";

function SHA256(str) {
    return Crypto_Base64.stringify(Crypto_SHA256(str));
}

function AES_encrypt(txt, key) {
    let obj = Crypto_AES.encrypt(txt, key);
    return Crypto_Base64.stringify(obj.ciphertext) + "," + Crypto_Base64.stringify(obj.iv) + "," + Crypto_Base64.stringify(obj.salt);
}

function AES_decrypt(ctxt, key) {
    ctxt = ctxt.split(",");
    for (let i = 0; i < 3; i++) {
        ctxt[i] = Crypto_Base64.parse(ctxt[i]);
    }
    return Crypto_Utf8.stringify(Crypto_AES.decrypt({
        ciphertext: ctxt[0],
        iv: ctxt[1],
        salt: ctxt[2]
    }, key));
}

function genRandomToken(length) {
    const possibles = letters + numbers;
    const randVals = new Uint8Array(length);
    crypto.getRandomValues(randVals);
    
    let out = "";
    for (let i = 0; i < length; i++) {
        out += possibles[randVals[i] % possibles.length];
    }
    return out;
}

function parseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (err) {
        return undefined;
    }
}

function readJSON(path) {
    return parseJSON(fs.readFileSync(path, {
        encoding: "utf8"
    }).toString());
}

function parseQuery(url) {
    let quesIdx = url.indexOf("?");
    if (quesIdx === -1) {
        return {};
    } else {
        let end = url.slice(quesIdx + 1);
        if (end.length > 2) {
            let vars = end.split("&");
            let keys = {};
            for (let i = 0; i < vars.length; i++) {
                let eqIdx = vars[i].indexOf("=");
                vars[i] = [
                    decodeURIComponent(vars[i].slice(0, eqIdx)),
                    decodeURIComponent(vars[i].slice(eqIdx + 1))
                ];
                let number = Number(vars[i][1]);
                if (!Number.isNaN(number)) {
                    vars[i][1] = number;
                }
                keys[vars[i][0]] = vars[i][1];
            }
            return keys;
        } else {
            return {};
        }
    }
}

async function useTree(path, tree, data, response) {
    let status = "404";
    try {
        for (let key in tree) {
            if (path === key || (key === "/" && path.length === 0)) {
                status = "200";
                await tree[key](path.slice(key.length), response, data);
            } else if (path.startsWith(key) && (key[key.length - 1] === "/" || key[key.length - 1] === "?") && key !== "/") {
                if (key === "/API/") {
                    if (tree[key][":ACTION"]) {
                        let newData = await tree[key][":ACTION"](path, response, data);
                        for (var prop in newData) {
                            data[prop] = newData[prop];
                        }
                    }
                    switch (data.request.method) {
                        case "POST": {
                            let postData = "";

                            data.request.on("data", chunk => {
                                postData += chunk;
                            });

                            data.request.on("end", async () => {
                                status = await useTree(path.slice(key.length), tree[key][":POST:"], {
                                    ...data,
                                    postData
                                }, response);
                                if (status === "404") response.write("404 Not Found");
                                response.end();
                            });

                            status = "pending";
                            break;
                        }
                        case "GET": {
                            status = await useTree(path.slice(key.length), tree[key][":GET:"], data, response);
                            break;
                        }
                    }
                } else if (typeof tree[key] === "function") {
                    status = "200";
                    await tree[key](path.slice(key.length), response, data);
                } else {
                    status = useTree(path.slice(key.length), tree[key], data, response);
                }
            } else if (key[key.length - 1] === "*" && path.startsWith(key.slice(0, key.length - 1))) {
                status = "200";
                await tree[key](path, response, data);
            } else if (key === ":ACTION") {
                let newData = await tree[key](path, response, data);
                for (var prop in newData) {
                    data[prop] = newData[prop];
                }
            }
        }
    } catch (err) {
        console.log(err);
        status = "500";
    }
    return status;
}

function readTemplatedHTML(path, obj) {
    const data = fs.readFileSync(path, "utf8");
    const newData = $.template(data, obj ?? {}, '\\');
    return newData;
}

class Router {
    #MASTER_KEY;
    tree;
    request;
    response;
    
    constructor(masterKey) {
        this.#MASTER_KEY = masterKey;
    }

    useTree(tree) {
        this.tree = tree;
    }

    useRequest(req, res) {
        this.request = req;
        this.response = res;
    }

    async handleRequest(path, data) {
        data.request = this.request;
        data.response = this.response;
        let status = await useTree(path, this.tree, data, this.response);

        if (!Number.isNaN(Number(status))) {
            data.response.statusCode = Number(status);
        }
        
        if (status === "404") {
            data.response.write("404 Not Found");
        } else if (status === "500") {
            data.response.write("500 Internal Server Error");
        }
        if (status !== "pending") {
            data.response.end();
        }
        return status;
    }

    getHashedIP() {
        let forwardedFor = this.response.req.headers["x-forwarded-for"];
        if (forwardedFor) {
            return SHA256(AES_encrypt(forwardedFor, this.#MASTER_KEY));
        } else {
            return undefined;
        }
    }

    parseQuery(url) {
        return parseQuery(url ?? this.request.url);
    }

    getURL() {
        let url = decodeURIComponent(this.request.url);
        if (url[url.length - 1] === "/") {
            url = url.slice(0, url.length - 1);
        }
        return url;
    }
}

module.exports = {
    Router,
    SHA256,
    AES_encrypt,
    AES_decrypt,
    parseJSON,
    readJSON,
    parseQuery,
    genRandomToken,
    readTemplatedHTML
};