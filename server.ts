import type { Http2ServerRequest, Http2ServerResponse } from "http2";

const fs = require("node:fs");
const http = require("node:http");
const bbq = require("./lib/barbequery-server");

interface Suggestion {
    q: string,
    desc: string
}

type SuggestionResponse = [string, Array<Suggestion>];

async function getNormalizedSuggestions(query: string) {
    interface BraveSuggestion {
        q: string,
        desc: string | undefined
    }

    let outArr: SuggestionResponse = [
        query,
        []
    ];
    
    try {
        const braveRes: Response = await fetch(`https://search.brave.com/api/suggest?q=${encodeURIComponent(query)}&rich=true&source=web`, {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
            }
        });
        const braveJSON: Array<string | Array<BraveSuggestion>> = await braveRes.json();
        console.log(braveJSON)

        if (braveJSON && Array.isArray(braveJSON[1])) {
            for (let i = 0; i < braveJSON[1].length; i++) {
                const braveSuggestion: BraveSuggestion = braveJSON[1][i];
                const suggestion: Suggestion = {
                    q: braveSuggestion.q,
                    desc: braveSuggestion.desc ?? ""
                };
                outArr[1].push(suggestion);
            }
        }
    } catch (err) {
        // unexpected results from brave
        console.log(err);
    }

    return outArr;
}

const projectTree = {
    "/": (path: string, out: Http2ServerResponse, data: object) => {
        out.writeHead(200, { "Content-Type": "text/html" });
        out.write(bbq.readTemplatedHTML("./search-page/index.html"));
    },
    "/API/": {
        ":ACTION": (path: string, out: Http2ServerResponse, data: object) => {

        },
        ":POST:": {
            ":ACTION": (path: string, out: Http2ServerResponse, data: object) => {
                out.writeHead(200, { "Content-Type": "application/json" });
            },
        },
        ":GET:": {
            ":ACTION": (path: string, out: Http2ServerResponse, data: object) => {
                out.writeHead(200, { "Content-Type": "application/json" });
            },
            "suggest?": async (path: string, out: Http2ServerResponse, data: object) => {
                const query = bbq.parseQuery("?" + path).q;

                let outArr: SuggestionResponse | [] = [];
                if (typeof query === "string") {
                    outArr = await getNormalizedSuggestions(query);
                }
                out.write(JSON.stringify(outArr));
            },
        }
    },
    "/CDN/": (path: string, out: Http2ServerResponse) => {
        let fileExt: string = path.split(".").reverse()[0];
        let filePath: string = path;
        
        if (fileExt !== "html" && fileExt !== "css" && fileExt !== "js") {
            out.setHeader("Cache-Control", "public, max-age=" + (60 * 60 * 24));
        }
        
        if (fileExt === "png") {
            out.writeHead(200, {"Content-Type": "image/png"});
        } else if (fileExt === "svg") {
            out.writeHead(200, {"Content-Type": "image/svg+xml"});
        } else if (fileExt === "css") {
            out.writeHead(200, {"Content-Type": "text/css"});
        } else if (fileExt === "js") {
            out.writeHead(200, {"Content-Type": "text/javascript"});
        }

        // send file if it exists
        if (fs.existsSync(filePath)) {
            out.write(fs.readFileSync(filePath));
        } else {
            out.write("404 Not Found");
        }
    }
};

// create router
const router = new bbq.Router("non-secret-key");
router.useTree(projectTree);

// create server
const httpServer = http.createServer(async (request: Http2ServerRequest, response: Http2ServerResponse) => {
    router.useRequest(request, response);
    let url: string = router.getURL();
    try {
        await router.handleRequest(url, { });
    } catch (err) {
        console.log(err);
        response.end();
    }
}).listen(3000, () => {
    console.log("Server Online at http://127.0.0.1:3000");
});
