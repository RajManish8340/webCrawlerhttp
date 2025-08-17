const {JSDOM} = require('jsdom')


async function crawlPage(currentURL) {
    console.log(`actively crawling: ${currentURL}`)

    try {
    const resp = await fetch(currentURL)

    if (resp.status > 399) {
        console.log(`error in fetch with statuscode ${resp.status} on page ${currentURL}`)
        return // just stop here (return) if the page in not available
    }   
    
    // to ensure the resp is html
    const contentType = resp.headers.get("content-type")
    if (!contentType.includes("text/html")) {
        console.log(`non html response , content type ${contentType} on page ${currentURL}`)
        return // just stop here (return) if the resp is not a html 
   
    }

    console.log(await resp.text())
    } catch (err){
        console.log(`error in fetch ( ${err.message} ) , on page ${currentURL}`)
    }
}

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
    getURLsFromHtml,
    crawlPage
}