const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express();

app.set('view engine', 'ejs')
// app.use(express.static("public"))
app.use("/public", express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }))

// encrypt variables
var encryptedEmail;
var encryptedPassword;
// decrypt variables
var decryptedEmail;
var decryptedPassword;

var userData=[]


// Encryption
const crypt = (salt, text) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text
        .split("")
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join("");
};

const decrypt = (salt, encoded) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
        .match(/.{1,2}/g)
        .map((hex) => parseInt(hex, 16))
        .map(applySaltToChar)
        .map((charCode) => String.fromCharCode(charCode))
        .join("");
};





var LoggedIn = false;
app.get("/", function (req, res) {
    res.render("index", { logger: LoggedIn })
}
);




app.get("/forgot-Password", function (req, res) {
    res.send("Reset karega kya")
}
);


app.post("/signUp", function (req, res) {
    // Encryption
    encryptedEmail = crypt("salt", req.body.email);
    encryptedPassword = crypt("salt", req.body.password);
    var newUser={
        fullName:req.body.firstName+req.body.lastName,
        email:encryptedEmail,
        password:encryptedPassword
    }
    userData.push(newUser)
    console.log(JSON.stringify(userData[0]))
    res.redirect("/")
}
);

app.post("/login", function (req, res) {
    console.log("logged encrypted mail:- "+crypt("salt", req.body.email));
    console.log("logged encrypted pass:- "+crypt("salt", req.body.password));

    // Decryption
    // decryptedEmail = decrypt("salt", encryptedEmail);
    // decryptedPassword = decrypt("salt", encryptedPassword);

    // Console.logs
    // console.log(decryptedEmail)
    // console.log(decryptedPassword)
    // Verification of mail and password
    LoggedIn = true;

    res.redirect("/")

}
);

app.get("/signOut", function (req, res) {
    LoggedIn = false
    res.redirect("/")
    // res.send("Blogs ")
}
);



app.listen(3000, () => {
    console.log("Server Started SuccessFully");
})