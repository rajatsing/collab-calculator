import { Component,OnInit,OnDestroy } from '@angular/core';
import { SocketService } from './socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  public messages: Array<any>;
    public chatBox: string;
    public livePanelString:string = '';
    public prevFlag:number = -1;
    public answer:string = '';
    public nums = [];
    public ops = [];
    public opText = '';

    public constructor(private socket: SocketService) {
        this.messages = []; //incoming messages
        this.chatBox = ""; // chat box that will diplay the full equation  before sending
    }
    public ngOnInit() {
        this.socket.getEventListener().subscribe(event => {
            if(event.type == "message") { // message event
                let data = event.data.content;
                if(event.data.sender) {
                    data = event.data.sender + ": " + data;
                }
                this.messages.push(data);
            }
        });
      }
      public ngOnDestroy() {
        this.socket.close();
    }
    // sending the message
    public send() {
        if(this.chatBox) {
            this.socket.send(this.chatBox);
            this.chatBox = "";
            this.reset();
        }
    }
    // printing the message
    public isSystemMessage(message: string) {
        return  "<strong>" + message + "</strong>"
    }


    addInput(inp, flag) {
        if(flag == 1 && this.livePanelString == '')
            return;

        if((flag == this.prevFlag) && flag == 1)
            return;
        else
            this.prevFlag = flag;

        this.livePanelString += inp+'';

        if(flag == 2) {
            this.nums.push(inp);
        }else{
            this.ops.push(inp);
        }

        this.chatBox = this.livePanelString;
    }

    // calculate logic for the calculator
    calculate() {
        let a = this.livePanelString.replace(/x/g, '*');
        this.answer = eval(a);
        this.chatBox = this.livePanelString +' = '+this.answer;
        this.livePanelString = this.answer;

        this.nums = [];
        this.ops = [];
        this.prevFlag = -1;
    }
    // reset button logic
    reset() {
        this.livePanelString = '';
        this.chatBox = '';
        this.nums = [];
        this.ops = [];
        this.prevFlag = -1;
    }
}
