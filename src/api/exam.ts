import request from "./axios";
import {
    Exam,
    ExamDetail,
    ExamOverview,
    Question,
    QuestionDetail,
    UserAnswer,
    UserExamWithAnswers
} from "../components/exam/exam";
import store from "../store";

export async function getAllExam(courseId: number): Promise<ExamOverview[]> {
    const token = store.state.token
    const res = await request.get('exam/getall', {
        params: {
            token,
            courseId
        }
    })
    return res.data.examList
}

export async function addExam(exam: Exam, questions: Question[]) {
    const token = store.state.token
    const res = await request.post('exam', {
        exam,
        questions,
        token
    })
    return ''
}

export async function getExam(examID: number): Promise<ExamDetail> {
    const token = store.state.token
    const res = await request.get('exam', {
        params: {
            token,
            examID
        }
    })
    return res.data.examDetail
}

export async function updateExam(exam: Exam, questions: Question[]) {
    const token = store.state.token
    const res = await request.post('exam/update', {
        exam,
        questions,
        token
    })
    return ''
}

export async function startExam(examID) {
    const token = store.state.token
    const res = await request.post('exam/start', {
        token,
        examID
    })
    return ''
}

export async function submitExam(answers:UserAnswer[]) {
    const token = store.state.token
    const res = await request.post('exam/submit', {
        token,
        answers
    })
    return ''
}

export async function finishExam(examID:number) {
    const token = store.state.token
    const res = await request.post('exam/finish', {
        token,
        examID
    })
    return ''
}

export async function delExam(examID: number) {
    const token = store.state.token
    const res = await request.post('exam/remove', {
        token,
        examID
    })
    return ''
}

export async function setScoreExam({stuID, examID, questionID, score}) {
    const token = store.state.token
    const res = await request.post('exam/setscore', {
        token,
        examID,
        stuID,
        questionID,
        score
    })
    return ''
}

export async function getStuExam(examID: number, stuID:number): Promise<UserExamWithAnswers> {
    const token = store.state.token
    const res = await request.get('exam/getstu', {
        params: {
            token,
            examID,
            stuID
        }
    })
    return res.data.stuExam
}
