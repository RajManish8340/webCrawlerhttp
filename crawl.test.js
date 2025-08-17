const { normalizeURL ,getURLsFromHtml } = require('./crawl.js')
const { test, expect } = require('@jest/globals')

test('normalizeURL strip protocol ', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL  strip trailing slash(/) ', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

// already taken care by newURL constructor
test('normalizeURL capitals ', () => {
    const input = 'https://BLog.Boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

// already taken care by newURL constructor
test('normalizeURL strip http ', () => {
    const input = 'http://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('getURLsFromHtml absolute', () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev/path">
            Boot.dev Blog
        </a>
    <body>
<html>
`
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHtml(inputHTMLBody,inputBaseURL)
    /* The href attribute is just a string. But when you access it in JavaScript via linkElement.href, the browser resolves it into a fully qualified URL using the WHATWG URL standard.
In that standard:
https://blog.boot.dev → missing a path → normalized → https://blog.boot.dev/

https://blog.boot.dev/path → already has a path → unchanged*/
    const expected = ["https://blog.boot.dev/path"] 
    expect(actual).toEqual(expected)
})



test('getURLsFromHtml relative', () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="/path/">
            Boot.dev Blog
        </a>
    <body>
<html>
`
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHtml(inputHTMLBody,inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"] 
    expect(actual).toEqual(expected)
})

test('getURLsFromHtml both absolute and relative', () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev/path1/">
            Boot.dev Blog Path One
        </a>
        <a href="/path2/">
            Boot.dev Blog Path Two 
        </a>
    <body>
<html>
`
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHtml(inputHTMLBody,inputBaseURL)
    const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"] 
    expect(actual).toEqual(expected)
})

test('getURLsFromHtml invalid', () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="invalid">
            Boot.dev Blog
        </a>
    <body>
<html>
`
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHtml(inputHTMLBody,inputBaseURL)
    const expected = [] 
    expect(actual).toEqual(expected)
})