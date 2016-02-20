var Promise = require('es6-promise').Promise;
var fs = require("fs");
var trello = require("node-trello");
var config = require("./config.js");

var tr = new trello(config.Settings.trelloKey, config.Settings.trelloAuth);

// A QVNotebook converts to a list and mutiple cards
var build = {"listName":"", "cards":[]};

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
    console.log("Processing");
    
    new Promise(function(toResolve, orReject){
        
        fs.readdir(argv[0], function(err, files){
            if(err){ throw err; }
            toResolve(files);
        });
        
    }).then(function(files){

        fs.readFile(argv[0]+"/meta.json", function(err, data){
            if(err){ throw err; }
            build.listName = JSON.parse(data.toString())["name"];
        });
        
        // remove meta.json as it was just processed above
        files.splice(files.indexOf("meta.json"),1);
     
        // read each file and get meta and content
        var readingFiles = [];
        files.forEach(function(file){
       
            readingFiles.push(new Promise(function(toResolve, orReject){
           
                 fs.readFile(argv[0]+"/"+file+"/meta.json", function(err, data){
                    if(err){ throw err; }
                    toResolve({'file':file, 'meta':JSON.parse(data.toString())}); 
                 });
                 
            }).then(function(data){
   
            
                     fs.readFile(argv[0]+"/"+data.file+"/content.json", function(err, content){
                        if(err){ throw err; }
                        var theContent = JSON.parse(content.toString());
                        var mergeCells = '';
                        theContent.cells.forEach(function(cell){
                            if(cell.type == "markdown"){
                                mergeCells += "\n\n"+cell.data;
                            } 
                         });
                         
                        data.content = mergeCells;
                        build.cards.push(data);
                    });
               
                        
            }));
            
        });
        
        Promise.all(readingFiles).then(function(value){
  
	      // got the build obj that we can now work on trellifying 
          
          var trelloPromise = new Promise(function(toResolve, toReject){
              tr.get("/1/members/my/boards", function(err, data){toResolve(data);})
          }).then(function(boards){

              boards.some(function(board){
                  if(board.name == argv[1]){
                      build.boardId = board.id;
                      return true;                        
                  }
              });
          }).then(function(){
              return new Promise(function(toResolve, orReject){
                  tr.post("/1/boards/"+build.boardId+"/lists", {name: build.listName}, function(err, list){toResolve(list)});
              });
          }).then(function(list){
               var addingCards = [];
               build.cards.forEach(function(card){
                    addingCards.push(new Promise(function(toResolve, orReject){
                        tr.post("/1/cards",{name:card.meta.title, idList:list.id, desc: card.content}, function(err, card){toResolve(card);});
                    }));
               });
               
               Promise.all(addingCards).then(function(){
                   console.log("Finished processing");
               });
          });
        });
   
    });
    
})(process.argv.slice(2));