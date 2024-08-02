# Unoogle Search
Unoogle Search is a fully open source search engine. Even our search index is publicly available allowing anyone to host their own mirror of Unoogle Search.

## About
Our goal is to eventually be self sufficient and generate all search results using our own search index. However, currently our search index is quite small and as a result we supplement results using Google and Brave Search.

## Start Server
Running the server requires Bun to be installed. Currently we use Bun because it supports TypeScript out of the box without
needing to transpile our code first. In addition Bun lets us combing commonjs and modulejs imports. Once Node gets these features
we may switch back to using Node. In the meantime you can run the project using Node but you'll have to transpile it first.
`npm start`