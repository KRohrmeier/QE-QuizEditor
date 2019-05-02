import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class QuizService {
  constructor(private builtInAngularHttpClient: HttpClient) {}

  getQuizzes() {
    return this.builtInAngularHttpClient.get(
      "https://modern-js.azurewebsites.net/api/HttpTriggerJS1?code=8XD3vN3ehHLdZacBQJQhgUnNst9202gdd5VM3kWCytDkz2nXhia6kA==&name=Mystery%20Quiz"
    );

    // Mocking up the data we will ultimately get from a
    // REST endpoint, or web service call...
    // return [
    //   { name: 'Quiz 1', numberQuestions: 3 }
    //   , { name: 'Quiz 2', numberQuestions: 0 }
    //   , { name: 'Quiz 3', numberQuestions: 0 }
    // ].map(x => ({
    //   name: x.name
    //   , numberOfQuestions: x.numberQuestions
    // }));
  }

  saveQuizzes(changedQuizzes: any[], newQuizzes: any[] = []) {
    let h = new HttpHeaders({
      "Content-Type": "application/json",
      "X-Sas-Token": "sig=K2WE6NQPtyoV6ke5hwPEaEaW52fgvyFWUeCEdPJls1s"
    });

    return this.builtInAngularHttpClient.post(
      "https://modern-js.azurewebsites.net/save-quizzes-proxy",
      JSON.stringify({
        changedQuizzes: changedQuizzes,
        newQuizzes: newQuizzes
      }),
      {
        headers: h
      }
    );
  }
}
