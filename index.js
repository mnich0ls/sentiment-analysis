let axios = require('axios')
let Sentiment = require('sentiment')

let getResponsesFromMarcus = (paragraphs) => {
    let responsesFromMarcus = []
    paragraphs.forEach(paragraph => {
        let questions = paragraph.split(/\?\n\s+Mr. Marcus\./)
        if (questions && questions.length > 1) {
            responsesFromMarcus.push(questions[1])
        }
    })
    return responsesFromMarcus
}

let getNegativeResponses = (responses) => {
    let sentiment = new Sentiment()
    return responses.filter(response => {
        let result = sentiment.analyze(response)
            return (result.score < 0)
    })
}

axios.get('https://www.govinfo.gov/content/pkg/CHRG-116shrg37919/html/CHRG-116shrg37919.htm')
    .then(res => {
        let content = res.data
        var conversationParts = content.split("STATEMENT OF DAVID A. MARCUS, HEAD OF CALIBRA, FACEBOOK")
        var conversation = conversationParts[1]
        conversationParts = conversation.split("PREPARED STATEMENT OF SENATOR SHERROD BROWN")
        conversation = conversationParts[0]
        let paragraphs = conversation.split(/\s+(Senator|Chairman)\s+\w+\./)
        let responses = getResponsesFromMarcus(paragraphs)
        console.log('total responses from marcus:', responses.length)
        let negativeResponses = getNegativeResponses(responses)
        console.log('total negative responses from marcus: ', negativeResponses.length)
        console.log('Negative responses:')
        negativeResponses.forEach(response => {
            console.log(response)
        })
    })