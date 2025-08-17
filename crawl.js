const {JSDOM} = require('jsdom')

function getURLsFromHtml(htmlBody, baseURL) {
    const urls = []
    const dom = new JSDOM(htmlBody)
    const linkElements = dom.window.document.querySelectorAll('a')
    for (const linkElement of linkElements) {

        if (linkElement.href.slice(0, 1) === '/') {
            //relative
            try{
                const urlObj = new URL(`${baseURL}${linkElement.href}`)
                urls.push(urlObj.href)
                // because we are using URL contructor if url is valid we will push it 
                //and if not we will cath the error and give a error message with that invalid url
            } catch(err) {
                console.log(`error with relative url : ${err.message}`)
            }
        } else {
            //absolute
            try{
                const urlObj = new URL(linkElement.href)
                urls.push(urlObj.href)
                // because we are using URL contructor if url is valid we will push it 
                //and if not we will cath the error and give a error message with that invalid url
            } catch(err) {
                console.log(`error with absolute url : ${err.message}`)
            }
        }
    }
    return urls
}

function normalizeURL(urlString){
    const urlObj = new URL(urlString)
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`
    if (hostPath.length > 0 && hostPath.endsWith('/') )  {
        return hostPath.slice(0,-1)
    } 

    return hostPath
    
}

module.exports = {
    normalizeURL ,
    getURLsFromHtml
}