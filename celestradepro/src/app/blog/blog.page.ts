import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
   // Holds the form data
   postData = { name: '', post: '' };

   // Example list of posts
   items = [
     { name: 'John Doe', post: 'This is a sample post.' },
     { name: 'Jane Smith', post: 'Another blog post here!' }
   ];
 
   // Function to handle form submission
   onSubmit() {
     if (this.postData.name && this.postData.post) {
       // Add the new post to the items array
       this.items.push({ name: this.postData.name, post: this.postData.post });
 
       // Clear the form fields
       this.postData = { name: '', post: '' };
     }
   }
 }


