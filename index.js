var fs = require("fs");
var trello = require("node-trello");
var config = require("./config.js");

//var tr = new trello(config.Settings.trelloKey, config.Settings.trelloAuth);

// A QVNotebook converts to a list and mutiple cards
var build = {};

(function (argv){
    
    // should check that the give path is a qvnotebook file
    // and a path was provided
    if(argv.length < 2) {
        console.log("Usage node index.js PATH_TO_QVNOTEBOOK BOARD_NAME");
        return;
    } else if ((argv[0].substring(argv[0].length - 10,argv[0].length)) != "qvnotebook"){
        console.log("Given path not a QVNotebook");
        return;
    }
 
    
    // given the 
    fs.readdir(argv[0], function(err, files){
        // should return atleast a meta.json file
        // if notes are present then 1 or more qvnote files
        //     qvnote files contain contents.json and meta.json files
        console.log(files);
        fs.readFile(argv[0]+"/"+files[1],function(err, data){
            if(err){
                throw err;
            }
       
            console.log(data.toString());
        });
    });
    
    
    
    
    /*fs.readFile(argv[0], function(err, data){
       if(err){
           throw err;
       }
       
       console.log(data.toString());
       
        
    });*/
    
    
})(process.argv.slice(2));