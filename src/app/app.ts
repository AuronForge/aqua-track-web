import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FeedbackMessageContainerComponent } from './shared/components/feedback-message-container/feedback-message-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FeedbackMessageContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly title = 'AquaTrack';
}
