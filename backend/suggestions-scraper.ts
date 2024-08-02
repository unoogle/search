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
