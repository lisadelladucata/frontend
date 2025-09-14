import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Question {
  quesId: string;
  optionId: string;
  description?: string;
  questionAnswer: {
    questionName?: string;
    questionTitle?: string;
    questionAnswer?: string;
  };
}

const initialState: { questions: Question[] } = {
  questions: [],
};

const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    addSelectedQuestions: (state, action: PayloadAction<Question>) => {
      const existingQuestion = state.questions.find(
        (q) => q.quesId === action.payload.quesId
      );

      if (existingQuestion) {
        existingQuestion.optionId = action.payload.optionId;
        existingQuestion.description = action.payload.description;
      } else {
        state.questions.push(action.payload);
      }
    },
  },
});

export const { addSelectedQuestions } = questionSlice.actions;
export default questionSlice.reducer;
