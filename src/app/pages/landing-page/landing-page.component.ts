import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [ NgOptimizedImage],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent { }
