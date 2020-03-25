const http = require('http')
const levenshtein = require('js-levenshtein')
const express = require('express')
const app = express();
const FS = require('fs')
const pug = require('pug')
const port = process.env.PORT || 5000
let publicDir = __dirname + '/public'; // rep contenant les fichiers
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
    'menier9999',
]
let nbRequestsMap = new Map(keys.map(k => [k, 0]))
app.set('port', (port))
app.use(express.static(publicDir))

http.createServer(app).listen(port, (err) => {
    if (err) console.log('Probleme : ', err)
    else console.log(`Le serveur est en ligne sur le port : `, app.get('port'))
}) //ou app.listen(port)

setInterval(resetNbRequests, 60000)

app.all('/:var(index.html)?', (req,res) => {
    console.log('requete : ', req.originalUrl)
    res.status(200).send(pug.renderFile('index.pug'))
})

app.get("/:user/distance",(req,res) => {
    console.log('requete : ', req.originalUrl)
    let user=req.params.user
    if (keys.includes(user)) {
        let A=req.query.A
        let B=req.query.B
        if (A==undefined || B==undefined) {
            console.log("requête mal formée")
            res.status(400).json({
                "utilisateur": user,
                "erreur": 'la requête est mal formée'
            })
        } else if ((A.length >= 50) || (B.length >= 50)) {
            console.log("chaine trop longue")
            res.status(400).json({
                "utilisateur": user,
                "erreur": 'une des deux chaînes est trop longue (gardez des chaînes inférieures à 50)'
            })
        } else if (!RegExp("^[ACGTacgt]+$").test(A) || !RegExp("^[ACGTacgt]+$").test(B)) {
            console.log("chaine ne code pas ADN")
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
                    "temps de calcul (ms)": execTime,
                    "interrogations minute": nbRequestsMap.get(user)
                })
            } else {
                console.log("nombre de requêtes dépassé")
                res.status(401).json({
                    "utilisateur": user,
                    "erreur": 'nombre de requêtes dépassé, attendez une minute'
                })
            }
        }
    } else {
        console.log("utilisateur non autorisé")
        res.status(401).json({
            "utilisateur": user,
            "erreur": 'vous n’avez pas les autorisations pour utiliser ce service'
        })
    }
})

app.get('/nbRequests', (req,res) => {
    res.status(200).json(Array.from(nbRequestsMap.entries()))
})

app.all('*', (req,res) => {
    console.log("requete invalide : ", req.path)
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