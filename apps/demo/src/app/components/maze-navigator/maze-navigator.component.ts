import { Component, OnInit, Output } from '@angular/core';
import { MazeService } from '../../services/maze.service';

@Component({
  selector: 'valant-maze-navigator',
  templateUrl: './maze-navigator.component.html',
  styleUrls: ['./maze-navigator.component.less']
})

export class MazeNavigatorComponent implements OnInit {
  moves: string[] = [];
  availableMazes: mazeItem[] = [{name:"Preloaded maze 0", isSelected : true, maze:"SOXXXXXXXX\r\nOOOXXXXXXX\r\nOXOOOXOOOO\r\nXXXXOXOXXO\r\nOOOOOOOXXO\r\nOXXOXXXXXO\r\nOOOOXXXXXE" }, 
                                {name:"Preloaded maze 1", isSelected : false, maze:"S ████████\r\n   ███████\r\n █   █    \r\n████ █ ██ \r\n       ██ \r\n ██ █████ \r\n    █████E" }];
  selectedMaze: string[][] = [[]];
  titleSelectedMaze: string = "maze001";

  mazePosition: mazePosition = {row:1, col:0 };
  mazeSize: mazePosition = {row:1, col:1 };
  key:string = "no key presed";
  keycode:number;

  mazeclicked :boolean = false;

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
    console.log("This is the file to place content: ", file);
    
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
    console.log("This is the read content method: ", file);
    
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
