import { Component, OnInit } from '@angular/core';
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

  constructor(private mazeService: MazeService) { }

  ngOnInit(): void {

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

  }

  handleFileChange(e:any){
    const file = e.target.files[0];
    if ( file ){
      console.log(file);
      // TODO: esto hay que quitarlo?
      this.mazeService.uploadMaze(file);
      this.startUploading(file);
      this.getFile(e);
    }
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

  stringToArray(inString:string){
    if (inString == undefined) return;
    return inString.split("");
  }

  startUploading ( file: any ) {
    console.log("Start Uploading File: ", file);
    
    this.mazeService.fileUpload(file).then((fileUrl)  => {
      console.log("La ruta del archivo es: ", fileUrl);
    });
  };



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