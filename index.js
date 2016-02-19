var Promise = require('es6-promise').Promise;
var fs = require("fs");
var trello = require("node-trello");
var config = require("./config.js");

//var tr = new trello(config.Settings.trelloKey, config.Settings.trelloAuth);

// A QVNotebook converts to a list and mutiple cards
var build = {listName:"", cards:[]};

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
 
    var notebooks;
    
    
    var read = new Promise(function(toResolve, orReject){
        
        fs.readdir(argv[0], function(err, files){toResolve(files);});
        
    }).then(function(files){

        fs.readFile(argv[0]+"/meta.json", function(err, data){
            if(err){
                throw err;
            }
            build.listName = JSON.parse(data.toString())["name"];
        });
        
        files.splice(files.indexOf("meta.json"),1);
     
        var readingFiles = [];
        files.forEach(function(file){
       
            readingFiles.push(new Promise(function(toResolve, orReject){
           
                 fs.readFile(argv[0]+"/"+file+"/meta.json", function(err, data){
                    toResolve({'file':file, 'meta':data.toString()});
                 
                 });
            }).then(function(data){
   
                return new Promise(function(toResolve, orReject){
                     fs.readFile(argv[0]+"/"+data.file+"/content.json", function(err, content){
                         data.content = content.toString();
                      toResolve(data);
                  });
                });
                
                 
            }).then(function(data){
               
                return new Promise(function(toResolve, orReject){
                    
                    build.cards.push(data)
                    
                    toResolve(build);
                });
            }));
            
        });
        
        Promise.all(readingFiles).then(function(value){
  
	      // got the build obj that we can now work on trellifying 
          console.log(build)
        });
        
        
    });
    
    
    
})(process.argv.slice(2));