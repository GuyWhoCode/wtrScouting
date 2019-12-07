# West Torrance Robotics Scouting App

Created by Jason

# Instructions and Maintenance

**ONLY** Edit the file called `objectives.json`

Do **NOT** Touch or Edit anything

# Editing the `objectives.json` File

All inputs must be in camelCase likeThis

All Inputs should not have any spaces

1. To make an objective, create a string under the specific section (Auto, Tele-Op, Endgame)
* Being under a specific section means typing the line below the name (Ex. "auto":{ )
* A String has "this" around it

2. Put a colon after it
* It is ':' (For those not enlightened)

3. Enter the type of the Objective
* There are only two possible types:
* Number Inputs -> type in the word, "Num"
* Checkbox Inputs -> type in the word, "T/F"

4. Put a comma (,) after it, and press enter 

5. Check your Work!
* Does the objective name have no space?
* Is it camelCase?
* Did you name its type?
* Did you correctly spell the type? It is cAsE sEnSiTiVe
* Check to see if all of the curly braces close (If { is eventually met with } after all of the objectives are made)

6. Example

    "parkedUnderBridge": "T/F",
    
    "skystoneBridge": "Num",
# Helpful Tips

* Literally don't edit any files except for `objectives.json`
* But if you do, then it will shat itself.
* And that's no good to debug.
* Results of the scouting app are shown [here](https://wtr-scouting.glitch.me/results).