import { Component, OnInit } from "@angular/core";
import { QuizService } from "./quiz.service";
import {
  trigger,
  transition,
  animate,
  keyframes,
  style
} from "@angular/animations";

interface QuizDisplay {
  name: string;
  originalName: string;

  questions: QuestionDisplay[];
  originalQuestionsChecksum: string;

  markedForDelete: boolean;
}

interface QuestionDisplay {
  name: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
  animations: [
    trigger("detailsFromLeft", [
      transition("leftPosition => finalPosition", [
        animate(
          "250ms",
          keyframes([
            style({ left: "-30px", offset: 0.0 }),
            style({ left: "-20px", offset: 0.25 }),
            style({ left: "-10px", offset: 0.5 }),
            style({ left: "-5px", offset: 0.75 }),
            style({ left: "0px", offset: 1.0 })
          ])
        )
      ])
    ]),
    trigger("pulseSaveCancelButtons", [
      transition("nothingToSave => somethingToSave", [
        animate(
          "400ms",
          keyframes([
            style({
              transform: "scale(1.0)",
              "transform-origin": "top left",
              offset: 0.0
            }),
            style({
              transform: "scale(1.2)",
              "transform-origin": "top left",
              offset: 0.5
            }),
            style({
              transform: "scale(1.0)",
              "transform-origin": "top left",
              offset: 1.0
            })
          ])
        )
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  constructor(private quizSvc: QuizService) {}

  errorCallingRestEndpoint = false;

  ngOnInit() {
    this.loadAllQuizzes();
  }

  title = "Batch Quiz-Editor";

  quizzes: QuizDisplay[] = [];
  selectedQuiz: QuizDisplay = undefined;

  saveBatchEdits() {
    const editedQuizzes = this.getEditedQuizzes().map((x) => ({
      name: x.name,
      orginalName: x.originalName,
      question: x.questions
    }));

    const addedQuizzes = [];

    this.quizSvc
      .saveQuizzes(editedQuizzes, addedQuizzes)
      .subscribe(
        (numberOfEditedQuizzesSaved) => console.log(numberOfEditedQuizzesSaved),
        (error) => console.log(error)
      );
  }

  cancelBatchEdits() {
    this.loadAllQuizzes();
    this.setSelectedQuiz(undefined);
  }

  private loadAllQuizzes() {
    this.quizSvc.getQuizzes().subscribe(
      (data) => {
        console.log(data);
        this.quizzes = (<any[]>data).map((x) => ({
          name: x.name,
          originalName: x.name,
          questions: x.questions,
          originalQuestionsChecksum: x.questions.map((x) => x.name).join("~"),
          markedForDelete: false
        }));
      },
      (error) => {
        console.log(error);
        this.errorCallingRestEndpoint = true;
      }
    );
  }

  setSelectedQuiz(q: QuizDisplay) {
    this.selectedQuiz = q;
    this.detailsAnimationState = "finalPosition";
  }

  addNewQuiz() {
    let newQuiz = {
      name: "New Untitled Quiz",
      originalName: "New Untitled Quiz",
      questions: [],
      originalQuestionsChecksum: "",
      markedForDelete: false
    };

    this.quizzes = [...this.quizzes, newQuiz];
    this.setSelectedQuiz(newQuiz);
  }

  removeQuestion(questionToDelete) {
    this.selectedQuiz.questions = this.selectedQuiz.questions.filter(
      (x) => x !== questionToDelete
    );
  }

  addNewQuestion() {
    this.selectedQuiz.questions = [
      ...this.selectedQuiz.questions,
      {
        name: "New Untitled Question"
      }
    ];
  }

  get numberOfDeletedQuizzes() {
    return this.quizzes.filter((x) => x.markedForDelete).length;
  }

  getEditedQuizzes() {
    return this.quizzes.filter(
      (x) =>
        !x.markedForDelete &&
        x.originalName !== "New Untitled Quiz" &&
        (x.name != x.originalName ||
          x.originalQuestionsChecksum !=
            x.questions.map((x) => x.name).join("~"))
    );
  }

  get numberOfEditedQuizzes() {
    return this.getEditedQuizzes().length;
  }

  get numberOfAddedQuizzes() {
    return this.quizzes.filter(
      (x) => !x.markedForDelete && x.originalName === "New Untitled Quiz"
    ).length;
  }

  //
  //  Animation properties and methods...
  //
  detailsAnimationState = "leftPosition";

  detailsFromLeftAnimationComplete() {
    this.detailsAnimationState = "leftPosition";
  }
}
