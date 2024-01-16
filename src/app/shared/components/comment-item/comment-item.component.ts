/// Angular
import { Component, OnInit, Input } from '@angular/core';

/// Interfaces
import { CommentWithUserName } from 'src/app/core/interfaces/comment';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss'],
})
export class CommentItemComponent implements OnInit {
  @Input() comment: CommentWithUserName | undefined

  constructor() { }

  ngOnInit() {}

}

