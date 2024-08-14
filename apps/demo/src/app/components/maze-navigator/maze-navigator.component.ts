import { Component, OnInit, Output } from '@angular/core';
import { MazeService } from '../../services/maze.service';

@Component({
  selector: 'valant-maze-navigator',
  templateUrl: './maze-navigator.component.html',
  styleUrls: ['./maze-navigator.component.less']
})

export class MazeNavigatorComponent implements OnInit {
  moves: string[] = [];
  availableMazes: mazeItem[] = [{name:"Preloaded maze000", isSelected : true, maze:"SOXXXXXXXX\r\nOOOXXXXXXX\r\nOXOOOXOOOO\r\nXXXXOXOXXO\r\nOOOOOOOXXO\r\nOXXOXXXXXO\r\nOOOOXXXXXE" }, 
                                {name:"Preloaded maze001", isSelected : false, maze:"S ████████\r\n   ███████\r\n █   █    \r\n████ █ ██ \r\n       ██ \r\n ██ █████ \r\n    █████E" }];
  selectedMaze: string[][] = [[]];
  titleSelectedMaze: string = "maze001";

  mazePosition: mazePosition = {row:1, col:0 };
  mazeSize: mazePosition = {row:1, col:1 };
  key:string = "no key presed";
  keycode:number;

  mazeclicked :boolean = false;

  NextMoves : string[] = ["Not started"];

  constructor(private mazeService: MazeService) { }
    
  ngOnInit(): void {
    // this.loadText('file:///C:/repos/maze-demo/apps/demo/src/assets/mazelibrary/maze001.txt');

    console.log("cargar movimientos: ");
    
    this.mazeService.getMovesList()
    .then(async (resp)=>{
      const body = await resp.json();
      this.moves = body;
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });

    this.mazeService.getMazeList()
    .then(async (resp)=>{
      const body = await resp.json();
      console.log("Maze List: ", body);
      body.forEach(element => {
        this.availableMazes.push({name: element, isSelected :false, maze:"" });
      });
    })
    .catch((e)=>{
        console.log("error: ", e);            
    });


    // let sMaze = this.mazeService.loadtxtFileMock(this.titleSelectedMaze);
    // // console.log(sMaze);
    // this.mazeSize.row= sMaze.length;      
    // this.mazeSize.col = this.mazeSize.row;      

    // sMaze.forEach(row => {
    //   console.log(row);
    //   let rowArray = this.stringToArray(row);
    //   this.selectedMaze.push(rowArray);
    //   this.mazeSize.col = rowArray.length;      

    // });
  }

  handleFileChange(e:any){
    const file = e.target.files[0];
    console.log(file);
    this.mazeService.uploadMaze(file);
    if ( file ){
      this.startUploading(file);
      this.getFile(e)
    }
  }

  startUploading ( file: any ) {
    console.log("Start Uploading File: ", file);
    
    this.mazeService.fileUpload(file).then((fileUrl)  => {
      console.log("La ruta del archivo es: ", fileUrl);
    });
  };
  
  stringToArray(inString:string){
    if (inString == undefined) return;
    return inString.split("");
  }

  getFile(event) {
    const input = event.target
    if ('files' in input && input.files.length > 0) {
      this.placeFileContent(input.files[0])
    }
  }

  placeFileContent(file) {
    this.readFileContent(file).then(content => {
      console.log(content);
      let rowsContent = this.stringToRows(content);
      this.mazeSize.row=rowsContent.length;      
      this.mazeSize.col=this.mazeSize.row;      
      this.selectedMaze = this.arrRowsToMatrix(rowsContent);
      this.titleSelectedMaze = file.name;
      this.availableMazes.push({name:file.name, isSelected:true, maze: content + "" });
    }).catch(error => console.log(error))
  }

  readFileContent(file) {
    console.log(file);
    
    const reader = new FileReader()
    return new Promise((resolve, reject) => {
      reader.onload = event => resolve(event.target.result)
      reader.onerror = error => reject(error)
      reader.readAsText(file)
    })
  }

  stringToRows(strMaze : any){
    let arrRows = strMaze.split("\n");
    return arrRows
  }

  arrRowsToMatrix(arr: string[]){
    let mazetrix : string[][] = [[]];

    arr.forEach(row => {
      console.log(row);
      let rowArray = this.stringToArray(row.replace("\r", "") );
      mazetrix.push(rowArray);
      this.mazeSize.col = rowArray.length;
    });
    return mazetrix;
  }

  selectMaze(mazeItem:mazeItem){
    console.log("Loading Selected Maze: ", mazeItem);
    this.availableMazes.forEach(x => x.isSelected= false);
    mazeItem.isSelected = true;  
    this.titleSelectedMaze = mazeItem.name;

    if (mazeItem.maze == "" || mazeItem.maze == null ) {
      let tempMaze = this.mazeService.getMazeContent(mazeItem.name);
      tempMaze.then(r => {
        console.log(r)
      } );
    }
    this.selectedMaze = this.arrRowsToMatrix(this.stringToRows(mazeItem.maze));

    this.readFileContent(mazeItem.name);
  }

  loadText(url) {
    console.log("loadText(url)", url);
    
    try {
      let text = fetch(url);
      //awaits for text.text() prop 
      //and then sends it to readText()
      this.readText( text ); 
    } catch (error) {
      console.log(error);
            
    }
  }

  readText(text){
      console.log(text);
  }

  readTextFile(file) {
    // var rawFile = new XMLHttpRequest();
    // rawFile.open("GET", file, false);
    // rawFile.onreadystatechange = function () {
    //   if(rawFile.readyState === 4)  {
    //     if(rawFile.status === 200 || rawFile.status == 0) {
    //       var allText = rawFile.responseText;
    //       console.log(allText);
    //      }
    //   }
    // }
    // rawFile.send(null);
    fetch(file)
      .then((res) => {
        res.text()
      })
      .then((text) => {
        // do something with "text"
        console.log("text: ", text);        
      })
      .catch((e) => console.error(e));
  }

  kdownhandler(event:any){
    console.log(event);
  }

  onKeydown(event) {
    this.key = event.key;
    this.keycode = event.code;
    console.log(event);
    this.handlePosition(this.key);
  }

  handlePosition(key: string){
    let initRow = this.mazePosition.row;
    let initCol = this.mazePosition.col;

    switch(key){
      case "ArrowDown": 
              if(this.mazePosition.row < this.mazeSize.row) this.mazePosition.row += 1; 
              break;
      case "ArrowUp": 
              if(this.mazePosition.row > 0) this.mazePosition.row -= 1; 
              break;
      case "ArrowRight": 
              if(this.mazePosition.col < this.mazeSize.col-1) this.mazePosition.col += 1; 
              break;
      case "ArrowLeft": 
        if(this.mazePosition.col > 0) this.mazePosition.col -= 1; 
              break;
      case "Default": break;
    }

    if (this.selectedMaze[this.mazePosition.row][this.mazePosition.col] == "X" ){
      console.log("Do not move", initRow, initCol);
      this.mazePosition.row = initRow;
      this.mazePosition.col = initCol;
      return;
    }
    if (this.selectedMaze[this.mazePosition.row][this.mazePosition.col] == "O" ){
      this.selectedMaze[this.mazePosition.row][this.mazePosition.col] = "o";
    }
    this.getNextMoves();
  }

  mazeclickhandler(){
    this.mazeclicked = true;
  }

  getNextMoves(){
    this.NextMoves = [];
    let currRow = this.mazePosition.row;
    let currCol = this.mazePosition.col;
    // check up
    if  (currRow>1 && this.selectedMaze[currRow-1][currCol] != "X") this.NextMoves.push("up, ");
    // check down
    if  (currRow<= this.mazeSize.row && this.selectedMaze[currRow+1][currCol] != "X") this.NextMoves.push("down, ");

    // check left
    if  (currCol>0 && this.selectedMaze[currRow][currCol-1] != "X") this.NextMoves.push("left, ");

    // check right
    if  (currCol< this.mazeSize.col && this.selectedMaze[currRow][currCol+1] != "X") this.NextMoves.push("right, ");

    this.NextMoves[this.NextMoves.length-1] = this.NextMoves[this.NextMoves.length-1].replace(",", "");
  }
}

interface mazeItem {
  name:string, 
  isSelected: boolean,
  maze?: string 
}

interface mazePosition {
  row:number, 
  col:number 
}