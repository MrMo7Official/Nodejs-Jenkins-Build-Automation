const readlineSync = require("readline-sync");
const axios = require("axios");
const fs = require("fs-extra");
const AdmZip = require("adm-zip")
const zip = new AdmZip();
require('dotenv').config();

const jenkinsConfig = JSON.parse(fs.readFileSync('jenkinsConfig.json'));
const jenkinsUrl = jenkinsConfig.jenkinsUrl
const userName = jenkinsConfig.userName;

const jenkinsToken = process.env.token || jenkinsConfig.jenkinsToken  /// Your access token
const Auth = `Basic ${Buffer.from(`${userName}:${jenkinsToken}`).toString('base64')}`
let buildID; let jobName; let fullData; let oldData = ""; let newData; let stats = null; /// for future use

let reqBuild = {
    method: 'post',
    headers: {Authorization:Auth}
};
let nextBuildID = {
    method: 'get',
    params:{pretty: false},
    headers: {Authorization:Auth}
}

let jobsList = {
    method: 'get',
    url: `${jenkinsUrl}/api/json`,
    params:{pretty: false},
    headers: {Authorization:Auth}
}


let reqLog = {
    method: 'get',
    headers: {Authorization:Auth}
};

let reqStats = {
    method: 'get',
    params:{pretty: false},
    headers: {Authorization:Auth}
}



/// start building
async function StartBuilding(){
    await listAllJobs();
    await findNextBuildID();
    await axios(reqBuild)
        .then(()=>{
            return Logging();
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function listAllJobs(){
    await axios(jobsList)
        .then(async function (response) {
            let jobs = response.data.jobs;
            if (jobs.length == 0) {
                return console.log("\\033[31mYou have no jobs available...\\033[0m")
            }
            let list = []
            let message = "\x1b[34m[0]\x1b[0m cancel"
            jobs.forEach(job => { list.push(job.name) })
            for (let i = 1; i <= list.length; i++){
                message += `\n\x1b[34m[${i}]\x1b[0m ${list[i-1]}`
            }

            let userInput = readlineSync.question(
                message+ "\n"+
                `What job you want to build ? [\x1b[34m0\x1b[0m to \x1b[34m${list.length}\x1b[0m]: \x1b[34m`
            );
            console.log("\x1b[0m")
            userInput = Number(userInput);
            if (isNaN(userInput) || userInput < 0 || userInput > list.length){
                console.log("\x1b[31mError : not a valid number !!\x1b[0m")
                process.exit()
            }else if (userInput == 0){process.exit()}

            jobName = list[userInput-1]
            reqBuild.url = `${jenkinsUrl}/job/${jobName}/build`
            nextBuildID.url = `${jenkinsUrl}/job/${jobName}/api/json`
        })
        .catch(function (error) {
            console.log(error);
        });
}

/// find the last build happened
async function findNextBuildID(){
    await axios(nextBuildID)
        .then(function (response) {
            buildID = response.data.nextBuildNumber;
            reqLog.url = `${jenkinsUrl}/job/${jobName}/${buildID}/logText/progressiveText`;
            reqStats.url = `${jenkinsUrl}/job/${jobName}/${buildID}/api/json`;
        })
        .catch(function (error) {
        });
}


/// logging saving and some outputs
async function Logging(){
    console.log(`\x1b[34mJob : ${jobName} \x1b[0m|| \x1b[34m( Build number ${buildID} ) started...\x1b[0m`);
    console.log("\x1b[33m=====================================================\x1b[0m")
    for (;!stats;) {
        await sleep(5000)
        await MakingStatsReq()
    }
    console.log("\x1b[33m=====================================================\x1b[0m")
    let date = new Date().getTime()
    let logPath = `logs/${jobName}/Build_${buildID}-${date}.log`
    let zipPath = `logs/${jobName}/Build_${buildID}-${date}.zip`;

    await fs.outputFile(logPath, fullData, err => {
        if (err) throw err;
        zip.addLocalFile(logPath);
        zip.writeZip(zipPath);
        fs.unlink(logPath, function (err) {
            if (err) throw err;
            console.log(`\x1b[32mlogs saved to \x1b[34m ${__dirname}/${zipPath} \x1b[0m\n`)
        })
    })
}

/// checking the stats of the build
async function MakingStatsReq(){
    await axios(reqStats).then( async function (response) {
        stats = response.data.result
        await MakingLogReq()
    }).catch(async function (error) {
        if (error.response.data.status == 404) {
            console.log("\x1b[35m trying to connect to log...\x1b[0m")
        }else {
            console.log(error.response.data)
        }
    });
}


/// checking the build Logs
async function MakingLogReq(){
    await axios(reqLog).then(async function (response) {
        fullData = response.data
        newData = response.data
        process.stdout.write(newData.replace(oldData,""));
        if (!stats) {oldData = newData}
    }).catch(function (error) {
        console.log(error)
    });
}



/// sleep func to make delays
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/// user input
async function input(prompt) {
    console.log(prompt);
    return (await rl[Symbol.asyncIterator]().next()).value;
}

StartBuilding()
