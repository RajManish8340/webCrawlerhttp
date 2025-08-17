const {crawlPage} = require('./crawl.js')

async function main() {
    if (process.argv.length < 3) {
        console.log("no website provided")
        process.exit(1)
    }
    if (process.argv.length >3) {
        console.log("too many cmd line args ")
        process.exit(1)
    }
    const baseURL = process.argv[2]
    
    console.log(`starting crawl of ${baseURL}`)
    const pages = await crawlPage(baseURL , baseURL , {})
     // crawl pages return pages which is a promise not a object thats why await

    // Object.entries(pages) this is because crawl pages return pages which is a promise not a object
    // and we cant iterate over a promise 
    // const page of pages is not valid 
    for (const page of Object.entries(pages) ) {
        console.log(page)
    }
}

main()
