import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Location, PopStateEvent } from "@angular/common";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  // yourName = 'new';

  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];


  constructor(private router: Router, private location: Location) { }

  ngOnInit(){
      this.location.subscribe((ev:PopStateEvent) => {
        this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((ev:any) => {
        if (ev instanceof NavigationStart) {
            if (ev.url != this.lastPoppedUrl)
                this.yScrollStack.push(window.scrollY);
        } else if (ev instanceof NavigationEnd) {
            if (ev.url == this.lastPoppedUrl) {
                this.lastPoppedUrl = undefined;
                window.scrollTo(0, this.yScrollStack.pop());
            } else
                window.scrollTo(0, 0);
        }
    });
  }
  top(){
    $('html, body').animate({
      scrollTop: $("#top-section").offset().top
  }, 1000)}

  // EVENT BINDING
  // update(event: Event){
  //   this.yourName = (<HTMLInputElement>event.target).value;
  // }
}
