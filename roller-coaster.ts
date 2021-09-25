import { RollerCoaster } from "./roller-coaster.d"

const fs = require('fs');
const readline = require('readline');

interface Earning {
    numberofplayers: number
    end: number
}

function executesimulation(rollercoaster: RollerCoaster) {
    let ride = 0
    let begin = 0, end;
    let totalbenifits = 0
    let numberofplayers // represents the number of players in one ride 

    var old_benifits: { [begin: number]: Earning } = {}
    while (ride < rollercoaster.numberOfRidesPerDay) {
        numberofplayers = 0
        let oneque = false // beucase i don't have time to  think about a more proper way 
        if (old_benifits[begin] !== undefined && ride < rollercoaster.numberOfRidesPerDay - 2) {

            totalbenifits += old_benifits[begin].numberofplayers
            begin = old_benifits[begin].end
        }
        else {
            end = begin
            while (numberofplayers <= rollercoaster.limitePersonsPerRide) {
                numberofplayers = numberofplayers + rollercoaster.personsPerGroup[end]
                end = (end + 1) % rollercoaster.numberOfGroups
                if (end == begin) {
                    oneque = true
                    break
                }
            }
            if (!oneque) {
                end = (end - 1 + rollercoaster.numberOfGroups) % rollercoaster.numberOfGroups // undo the last changes of the loop 
                numberofplayers -= rollercoaster.personsPerGroup[end];
            }
            totalbenifits += numberofplayers
            /// adding the result to thje memory 
            old_benifits[begin] = {
                numberofplayers: numberofplayers,
                end: end
            }
            begin = end
        }

        ride++

    }
    console.log(totalbenifits)
    return totalbenifits
}



// parsing function 
async function parsesample(path: string) {
    console.log("hello")
    var myrollerCoaster: RollerCoaster = {
        limitePersonsPerRide: - 1, numberOfRidesPerDay: -1, numberOfGroups: -1, personsPerGroup: []
    };
    const readInterface = readline.createInterface({
        input: fs.createReadStream(path),
        console: false
    });
    var firstline = true; // use it to get only the first line 
    await readInterface.on('line', function (line: string) {
        if (firstline) {
            firstline = false;
            [myrollerCoaster.limitePersonsPerRide, myrollerCoaster.numberOfRidesPerDay, myrollerCoaster.numberOfGroups] = line.split(" ").map(function (e: string) { return parseInt(e) });
        } else {
            myrollerCoaster.personsPerGroup.push(Number(line))
        }

        // return myrollerCoaster;
    }).on('close', () => {
        console.log("begin calculation")

        return executesimulation(myrollerCoaster);
    });
    // TODO  the this and remove calling the execution from the parse sample function 




}

// manual testing since the automatic one failed 

// parsesample("./samples/1_simple_case.txt")
// parsesample("./samples/2_1000_groups_of_few_people.txt")
// parsesample("./samples/3_the_same_groups_go_on_the_ride_several_times_during_the_day.txt")
// parsesample("./samples/4_all_the_people_get_on_the_roller_coaster_at_least_once.txt")
// parsesample("./samples/5_high_earnings_during_the_day.txt")
// parsesample("./samples/6_works_with_a_large_dataset.txt") // error 
// parsesample("./samples/7.hard.txt") // error
parsesample("./samples/8.harder.txt") // DIDN'T work
