const {JSDOM} = require('jsdom')


async function crawlPage(baseURL , currentURL, pages) {

    // to avoid crawling external urls on the page 
    const baseURLObj = new URL(baseURL)
    const currentURLObj = new URL(currentURL)
    if(baseURLObj.hostname !== currentURLObj.hostname) {
        return pages 
    }

    // check if that URL is already in your pages object:
    // If it’s there (> 0), you increment it.
    // If not, you add it to the object and set it to 1.
    const normalizedCurrentURL = normalizeURL(currentURL)
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }
    pages[normalizedCurrentURL] = 1

    console.log(`actively crawling: ${currentURL}`)


    try {
        const resp = await fetch(currentURL)

        if (resp.status > 399) {
            console.log(`error in fetch with statuscode ${resp.status} on page ${currentURL}`)
            return pages // just stop here (return) if the page in not available and return pages
        }   
        
        // to ensure the resp is html
        const contentType = resp.headers.get("content-type")
        if (!contentType.includes("text/html")) {
            console.log(`non html response , content type ${contentType} on page ${currentURL}`)
            return pages // just stop here (return) if the resp is not a html and return pages
    
        }

        const htmlBody = await resp.text()

        const nextURLs = getURLsFromHtml(htmlBody,baseURL)

        for(const nextURL of nextURLs){
            pages = await crawlPage(baseURL, nextURL , pages)
        }

    } catch (err){
        console.log(`error in fetch ( ${err.message} ) , on page ${currentURL}`)
    }
    return pages
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