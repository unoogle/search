const searchContainer = $("#search-container");
const searchInput = $("#search-input");

const suggestionsContainer = $("#suggestions-container");
const suggestions = $("#suggestions");

const suggestionsCache = {};

function wait(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

function unsimilarity(toks1, toks2, d=0) {
    let dist = 0;
    
    for (let i = 0; i < toks1.length; i++) {
        const w1 = toks1[i];
        const w2 = toks2[i];

        // if not exact match
        if (w1 !== w2) {
            // other query has word
            if (toks2.includes(w1)) {
                dist += 0.25;
            }
            // other query has subset of word
            else if (
                w1 !== undefined && w2 !== undefined && 
                (
                    (w1.length > w2.length && w1.startsWith(w2)) || 
                (   w2.length > w1.length && w2.startsWith(w1))
                )
            ) {
                dist += Math.abs(w2.length - w1.length) / Math.max(w1.length, w2.length);
            } 
            // other query doesn't have word
            else {
                dist += 1;
            }
        }
    }

    if (d === 0) {
        return (dist + unsimilarity(toks2, toks1, 1)) / 2;
    } else {
        return dist;
    }
}

// function highlightSearch() {
//     searchContainer.css({
//         backgroundColor: "rgb(49, 49, 59)",
//         border: "2px solid rgb(49, 49, 59)",
//         boxShadow: "0px 0px 5px black"
//     });
// }

// function unhighlightSearch() {
//     searchContainer.css({
//         borderBottomLeftRadius: "20px",
//         borderBottomRightRadius: "20px",
//         backgroundColor: "transparent",
//         border: "2px solid rgb(95, 100, 100)",
//         boxShadow: "none"
//     });
// }

function hideSuggestions() {
    searchContainer.unhighlight();
    suggestionsContainer.css({
        display: "none"
    });
}

let suggestedEls = [];
let selectedSuggest = -1;
function updateSuggestions() {
    suggestedEls = [];
    suggestions.html("");

    const query = searchInput.value;
    const cachedQueries = Object.keys(suggestionsCache);
    let similarities = [];
    for (let i = 0; i < cachedQueries.length; i++) {
        const cachedQuery = cachedQueries[i];
        similarities.push([
            cachedQuery,
            unsimilarity(cachedQuery.split(' '), query.split(' '))
        ]);
    }
    similarities.sort((a, b) => a[1] - b[1]);

    const usedQuery = similarities.length > 0 ? similarities[0][0] : query;
    const currentSuggestions = suggestionsCache[usedQuery];
    if (currentSuggestions) {
        searchContainer.highlight();
        searchContainer.css({
            borderBottomLeftRadius: "0px",
            borderBottomRightRadius: "0px"
        });

        suggestionsContainer.css({
            display: "block"
        });

        currentSuggestions.forEach(suggestion => {
            const el = $("suggestion", suggestion).appendTo(suggestions);
            if (el.$(".description")[0].text().trim().length === 0) {
                el.$(".label")[0].css({
                    lineHeight: "2.1em"
                })
            }
            suggestedEls.push(el);
        })

        selectedSuggest = -1;
    } else {
        // hideSuggestions();
    }
}

updateSuggestions();

let lastSuggest = 0;
let lastQuery = "";
function checkToUpdateSuggestions() {
    const now = Date.now();
    const query = searchInput.value;

    if (document.activeElement === searchInput.native && query.trim().length > 0) {
        // display cached suggestions
        if (suggestionsContainer.style.display === "none") {
            updateSuggestions();
        }

        // changed + ratelimit + only request if not cached
        if (query !== lastQuery && now - lastSuggest > 0.5 && !suggestionsCache[query]) {
            fetch("/API/suggest?q=" + encodeURIComponent(query))
                .then(res => res.json())
                .then(json => {
                    // console.log(json)
                    if (Array.isArray(json)) {
                        suggestionsCache[json[0]] = json[1];
                        updateSuggestions();
                    }
                })
            lastSuggest = now;
            lastQuery = query;
        }
    }
}

searchInput.on("keyup", checkToUpdateSuggestions)

setInterval(checkToUpdateSuggestions, 1000 / 2)

searchInput.on("keydown", e => {
    if (suggestedEls.length > 0) {
        let previousSelected = selectedSuggest;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            selectedSuggest++;
            if (selectedSuggest == suggestedEls.length) {
                selectedSuggest = 0;
            }
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            selectedSuggest--;
            if (selectedSuggest == -1) {
                selectedSuggest = suggestedEls.length - 1;
            }
        }
        if (previousSelected !== -1) {
            suggestedEls[previousSelected].removeClass("selected")
        }
        if (selectedSuggest !== -1) {
            suggestedEls[selectedSuggest].addClass("selected")
        }
    }
})

searchInput.on("click", updateSuggestions)

searchContainer.on("mouseover", () => {
    searchContainer.highlight();
})

searchContainer.on("mouseout", () => {
    if (document.activeElement !== searchInput.native) {
        searchContainer.unhighlight();
    }
})

window.addEventListener("mouseup", e => {
    if (e.target === searchInput.native) {
        updateSuggestions();
    } else {
        hideSuggestions();
    }
})