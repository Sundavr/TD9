const http = require('http')
const levenshtein = require('js-levenshtein')
const express = require('express')
const app = express();
const pug = require('pug')
const port = process.env.PORT || 5000
let publicDir = __dirname + '/public' // rep contenant les fichiers
let keys = [
    'gibbs4567',
    'toto0000',
    'tutu1111',
    'titi2222',
    'jojo5656',
    'max5008',
    'mael3333',
    'alexandre4444',
    'coucoucestmoi5555',
    'menier7777',
]
let nbRequestsMap = new Map(keys.map(k => [k, 0]))
app.set('port', (port))
app.use(express.static(publicDir))

http.createServer(app).listen(port, (err) => {
    if (!err) console.log('server is running on port', port)
    else console.log(err)
}) //ou app.listen(port)

setInterval(resetNbRequests, 60000)

app.all('/:var(index.html)?', (req,res) => {
    res.status(200).send(pug.renderFile('index.pug'))
})

app.all('/dnaComparator', (req,res) => {
    res.status(200).send(pug.renderFile('dnaComparator.pug'))
})

app.get("/:user/distance",(req,res) => {
    let user=req.params.user
    if (keys.includes(user)) {
        let A=req.query.A
        let B=req.query.B
        if (A==undefined || B==undefined) {
            res.status(400).json({
                "utilisateur": user,
                "erreur": 'la requête est mal formée'
            })
        } else if ((A.length >= 50) || (B.length >= 50)) {
            res.status(400).json({
                "utilisateur": user,
                "erreur": 'une des deux chaînes est trop longue (gardez des chaînes inférieures à 50)'
            })
        } else if (!RegExp("^[ACGT]+$").test(A) || !RegExp("^[ACGT]+$").test(B)) {
            res.status(400).json({
                "utilisateur": user,
                "erreur": 'une des chaînes ne code pas de l’ADN'
            })
        } else {
            if (nbRequestsMap.get(user) < 5) {
                incrementNbRequest(user)
                let startTime = new Date().getTime()
                distance = levenshtein(A,B)
                let execTime = new Date().getTime() - startTime
                res.status(200).json({
                    "utilisateur": user,
                    "date": new Date(),
                    "A": A,
                    "B": B,
                    "distance": distance,
                    "tempsCalcul": execTime,
                    "interrogationsMinute": nbRequestsMap.get(user)
                })
            } else {
                res.status(401).json({
                    "utilisateur": user,
                    "erreur": 'nombre de requêtes dépassé, attendez une minute'
                })
            }
        }
    } else {
        res.status(401).json({
            "utilisateur": user,
            "erreur": 'vous n’avez pas les autorisations pour utiliser ce service'
        })
    }
})

app.get('/nbRequests', (req,res) => {
    res.status(200).json([...nbRequestsMap.values()].reduce((a,b) => a+b))
})

app.all('*', (req,res) => {
    res.status(404).send("Page not found !")
})

function incrementNbRequest(key) {
    nbRequestsMap.set(key, nbRequestsMap.get(key)+1)
}

function resetNbRequests() {
    [...nbRequestsMap.keys()].forEach((key) => {
        nbRequestsMap.set(key, 0);
    })
}