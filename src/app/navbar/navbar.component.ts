import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor() { }

  ngOnInit() {
      const navSlide = () => {
        const burger = document.querySelector('.burger');
        const nav = document.querySelector('.nav-links');
        const navSoical = document.querySelector('.social-links');
        const navLinks = document.querySelectorAll('.nav-links li')

        burger.addEventListener('click', () =>{
          nav.classList.toggle('nav-active');
          navSoical.classList.toggle('nav-active1');

          //animate links
          navLinks.forEach((link, index) => {
            if (link.style.animation) {
              link.style.animation = '';
            }else{
              link.style.animation = `navFade 0.5s ease forwards $(index /7 + 5)s`;
            }
          });
          //burger animation
          burger.classList.toggle('toggle');

        });


 
      }
    navSlide();
  }

}
