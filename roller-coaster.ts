import { RollerCoaster } from "./roller-coaster.d"

const fs = require('fs');
const readline = require('readline');

interface Earning {
    numberofplayers: number
    size: number
}

function executesimulation(rollercoaster: RollerCoaster) {
    let ride = 0
    let begin = 0, end;
    let totalbenifits = 0
    let numberofplayers
    // console.log(rollercoaster)
    var old_benifits: { [begin: number]: Earning } = {}
    while (ride < rollercoaster.numberOfRidesPerDay) {
        // console.log(begin, ' to', totalbenifits)
        numberofplayers = 0
        if (old_benifits[begin]) {

            // console.log("begin : " + begin + " benifits " + old_benifits[begin].numberofplayers)
            begin = (begin + old_benifits[begin].size) % rollercoaster.numberOfGroups
            totalbenifits += old_benifits[begin].numberofplayers

        }
        else {
            end = begin
            while (numberofplayers <= rollercoaster.limitePersonsPerRide) {
                numberofplayers = numberofplayers + rollercoaster.personsPerGroup[end]
                end = (end + 1) % rollercoaster.numberOfGroups
                // console.log("bgin : " + begin)
                // console.log('numberofplayers ', numberofplayers)
            }
            end = (end - 1 + rollercoaster.numberOfGroups) % rollercoaster.numberOfGroups // undo the last changes of the loop 
            numberofplayers -= rollercoaster.personsPerGroup[end];
            totalbenifits += numberofplayers
            /// adding the result to thje memory 
            old_benifits[begin] = {
                numberofplayers: numberofplayers,
                size: (end - begin + rollercoaster.numberOfGroups) % rollercoaster.numberOfGroups
            }
            begin = end
        }
        // if (begin === 0) {
        //     console.log("we came back ")
        //     let remainingoops = rollercoaster.numberOfRidesPerDay / ride - 1
        //     totalbenifits *= remainingoops
        // }
        // console.log("totalbenifits : " + totalbenifits)
        // first optimization when we go into a loop - low chance , easy to implement 
        ride++
        // get number who will get into the ride 
        // shift the indexes of begining and end 
        // 
    }
    console.log(totalbenifits)
}



// parsing function 
async function parsesample(path: string) {
    console.log("hello")
    var myrollerCoaster: RollerCoaster = {
        limitePersonsPerRide: - 1, numberOfRidesPerDay: -1, numberOfGroups: -1, personsPerGroup: []
    };
    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        // output: process.stdout,
        console: false
    });
    // for (const line of readInterface) {
    //     console.log(line);
    // }
    var firstline = true; // use it to get only the first line 
    await readInterface.on('line', function (line: string) {
        if (firstline) {
            firstline = false;
            [myrollerCoaster.limitePersonsPerRide, myrollerCoaster.numberOfRidesPerDay, myrollerCoaster.numberOfGroups] = line.split(" ").map(function (e: string) { return parseInt(e) });
            // myrollerCoaster = { , personsPerGroup: [] }
        } else {
            myrollerCoaster.personsPerGroup.push(Number(line))
        }

        // return myrollerCoaster;
    }).on('close', () => {
        console.log("begin calculation")
        executesimulation(myrollerCoaster);
    });
    // TODO  the this and remove calling the execution from the parse sample function 


    return myrollerCoaster;

}

// parsesample("./samples/1_simple_case.txt")
// parsesample("./samples/2_1000_groups_of_few_people.txt")
// parsesample("./samples/3_the_same_groups_go_on_the_ride_several_times_during_the_day.txt")
// parsesample("./samples/4_all_the_people_get_on_the_roller_coaster_at_least_once.txt") // error 
// parsesample("./samples/5_high_earnings_during_the_day.txt")
// parsesample("./samples/6_works_with_a_large_dataset.txt") // error 
parsesample("./samples/7.hard.txt")
// parsesample("./samples/8.harder.txt") // DIDNT work
// try {
//     let x = yield parsesample("./samples/1_simple_case.txt")
//     executesimulation(x)
// }
// catch (err) {
//     console.log(err)
// }