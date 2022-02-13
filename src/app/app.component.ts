import { Component } from '@angular/core';

declare function rSC(data:string): void;
declare function formatText(data:string): "";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'dictionary';
  textInput:string = '';
  fetchedWord:Array<object> = new Array();
  recentWords:Array<any> = [];

  onChangeEvent(event:any): void{
    this.textInput = event.target.value;
    //console.log('oninput::',event.target.value);
  };
  ngOnInit(): void {
      //window.localStorage.clear();
    console.log('INIT');
    var lsRecent:string|null = localStorage.getItem('recent');

    var sHTML = '';
    if (lsRecent){
      this.recentWords = JSON.parse(lsRecent);
    }
  };
  deleteRecent(event:any): void{
    var o = this.recentWords;
    var thisRow = Array.prototype.indexOf.call(event.target.parentElement.parentElement.childNodes, event.target.parentElement);
    o.splice(thisRow, 1);
    this.recentWords = o;
    localStorage.setItem('recent', JSON.stringify(o));
    //console.log(thisRow,'<<deleteRecent::',event.target.parentElement);
  };
  viewRecent(event:any): void{
    var o = this.recentWords;
    var thisRow = Array.prototype.indexOf.call(event.target.parentElement.parentElement.childNodes, event.target.parentElement);
    this.textInput = o[thisRow].word;
    this.fetchWord(event);
    //console.log(thisRow,'<<viewRecent::',o[thisRow].word);
  };
  fetchWord(event:any): void {
    //this.textInput = 'bugger';
  //  var sentthis = rSC(this.textInput);
    if (this.textInput.length===0){
      alert('Please enter  word!!');
    }else{
    var newData = new Promise<any>((resolve,reject)=>{
     const path = 'https://apiapi.monkeywithoutthee.com/getWordFrom/58/'
          window.fetch(path, {
            method: 'POST',
            headers: {
              'Accept': 'application/json','Content-Type': 'application/json','monkey':'spL1shSplAshSploS4'
            },
            body:JSON.stringify({text:rSC(this.textInput),fetchType:0})
          })
            .then(response => response.json())
            .then(data => {
              resolve(data);
            })
            .catch(error => {
            //  toastSuccess("There was an error!");
              console.log("error::;", error);
              reject(error);
            })
      })
      newData.then((data)=>{
      //  console.log('newData::',data);

        var o = data[0];
        this.fetchedWord.unshift(o);
        var el = document.querySelector('.word');
        if(el){el.innerHTML = formatText(o.word)};
        el = document.querySelector('.definition');
        if(el){el.innerHTML = formatText(o.definition)};
        let a = new Array();
        var lsRecent:string|null = localStorage.getItem('recent');

        if (lsRecent){a = JSON.parse(lsRecent);};
        if (!o.word.includes('is not a word')){//quick fix!
          a.unshift({word:o.word});
        };
        this.recentWords = a;
        localStorage.setItem('recent', JSON.stringify(a));
        //console.log(this.recentWords,'<<fetch word COMPLETE::', data);
      //  console.log(localStorage.getItem('recent'),'<<heloooo::',this.textInput);
      })
    }

  };

}
