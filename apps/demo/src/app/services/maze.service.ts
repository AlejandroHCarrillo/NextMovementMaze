import { Injectable } from '@angular/core';
import { fetchSimple, fetchToken } from '../helpers/fetch';
import { environment } from '../../environments/environment';

let baseURL = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})
export class MazeService {
  
  constructor() { }

  getMovesList(urlQueryParams?:string) {
    return fetchSimple(`maze`, urlQueryParams, 'GET');
  }

  getMazeList(urlQueryParams?:string) {
    return fetchSimple(`maze/mazelist`, urlQueryParams, 'GET');
  }

  getMazeContent(urlQueryParams?:string) {
    return fetchToken(`maze/mazecontent`, "filename="+urlQueryParams, 'GET');
  }

  uploadMaze(file:any){
    console.log("upload maze file: ", file);
    return fetchSimple(`maze/upload`, file, 'POST');    
  }

  // loadtxtFileMock (filename:string) {
  //   let file: string[] = [];

  //   file.push("SOXXXXXXXX");
  //   file.push("OOOXXXXXXX");
  //   file.push("OXOOOXOOOO");
  //   file.push("XXXXOXOXXO");
  //   file.push("OOOOOOOXXO");
  //   file.push("OXXOXXXXXO");
  //   file.push("OOOOXXXXXE");

  //   return file;
  // }

  // files: any[] = [];
  // loadtxtFile (filename:string) {
  //   this.files.push("Maze000.txt");

  //   let textContent : any;
  //   let file: string[] = [];

  //   let fr = new FileReader();
  //   // let textContent = "";
  //   fr.onload = function () {
  //       textContent = fr.result;
  //   }

  //   // fr.readAsText(this.files[0]);
  //   // fr.readAsText(this.files[0]);

  //   return file;
  // }

  async fileUpload (file:any) {
    const uploadUrl = baseURL + '/maze/upload';
    const formData = new FormData();
    formData.append('upload_preset', 'react-journal');
    formData.append('file', file);

    try {
        const resp = await fetch(uploadUrl, {
                                method: 'POST', 
                                body: formData
                                });
        if( resp.ok ){
            console.log('subio OK');
            const response = await resp.json();
            // console.log(cloudResp.secure_url);            
            return response.secure_url;
        } else {
            console.log('No subio', await resp.json());
            throw await resp.json();
            return null;       
        }
    } catch (error) {
        console.log(error);
        throw error;            
    }
  }

}
