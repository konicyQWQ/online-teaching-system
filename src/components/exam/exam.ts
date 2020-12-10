import {reactive} from 'vue'
import {getAllExam, getExam, getStuExam} from "../../api/exam";
import {message} from "ant-design-vue";
import {User} from "../../type/user";

export const AnswerSeparator = "!&!"
export const MulSeparator = "!|!"

export enum QuestionType {
    True_False,
    Single_Choice,
    Multi_Choice,
    Fill_In_Blanks,
    Sub_Question,
}

export declare interface Question {
    examId?: number,
    questionId: number,
    type: QuestionType,
    content?: string,
    optionA?: string,
    optionB?: string,
    optionC?: string,
    optionD?: string,
    optionE?: string,
    optionF?: string,
    optionG?: string,
    optionH?: string,
    options?: string[],
    optionNum?: number,
    rightAnswer?: string,
    mark?: number
}

export declare interface QuestionStatistics {
    correctCount?: number,
    averageScore?: number,
    optionCount?: number[]
}

export declare interface QuestionDetail {
    question: Question,
    statistics: QuestionStatistics
}

export declare interface Exam {
    examId: number,
    courseId: number,
    title: string,
    maxMark: number,
    percentage: number,
    startTime: Date,
    duration: number,
    status: number
}

interface ExamWithQuestions {
    exam: Exam,
    questions: Question[]
}

export declare interface ExamState {
    loading: boolean,
    questions: QuestionDetail[],
    header: Exam,
    userExam: UserExamWithAnswers,
    statistics: ExamStatistics,
    userExams: UserExamOverView[]
}

export declare interface ExamStatistics {
    totalCount: number,
    startCount: number,
    finishedCount: number,
    averageMark: number,
}

export declare interface UserExamOverView {
    userInfo: User,
    exam: Exam,
    userExam: UserExam
}

export declare interface UserAnswer {
    userId: string,
    examId: number,
    questionId: number,
    answer: string,
    mark: number
}

export declare interface UserExamWithAnswers {
    userInfo: User,
    userExam: UserExam,
    answers: UserAnswer[]
}

export declare interface ExamWithQuestionDetails {
    questions: QuestionDetail[],
    exam: Exam
}

export declare interface ExamDetail {
    examWithQuestions: ExamWithQuestionDetails,
    statistics: ExamStatistics,
    userExams: UserExamOverView[]
    userExam: UserExamOverView | UserExamWithAnswers
    exam?: ExamDetail | ExamWithQuestions,

}

export declare interface UserExam {
    userId: string,
    examId: number,
    mark: number
}

export declare interface ExamOverview {
    exam: Exam,
    userExam: UserExam,
    statistics: ExamStatistics
}

export declare interface AllExamState {
    loading: boolean,
    data: ExamOverview[],
}

export function useAllExam(courseId: number) {
    const state = reactive({
        loading: false,
        data: []
    })

    function fetchData() {
        state.loading = true
        getAllExam(courseId)
            .then(res => {
                state.loading = false
                state.data = res
            })
            .catch(e => {
                message.error(e)
            })
    }

    // fetchData()

    return {
        state,
        fetchData
    }
}

export function useExam(examId: number, courseId: number, stuId: number) {
    const state = reactive({
        loading: false,
        questions: [],
        header: {
            courseId: courseId,
            examId: examId,
            title: '考试标题点击可编辑',
            maxMark: 100,
            percentage: 0,
            startTime: new Date(),
            duration: 120
        },
        userExam: {
            userInfo: {

            },
            userExam: {

            }
        },
        statistics: {

        }
    } as ExamState)

    // 老师获得数据
    async function fetchData() {
        state.loading = true

        if(stuId) {
            try {
                const [res1, res2] = await Promise.all([getExam(examId), getStuExam(examId, stuId)])
                res1.examWithQuestions.questions.forEach((value, index) => {
                    if(value.question.type === QuestionType.Single_Choice || value.question.type === QuestionType.Multi_Choice) {
                        let array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                        value.question.options = []
                        for(let i in array) {
                            if(value.question[`option${array[i]}`]) {
                                value.question.options.push(value.question[`option${array[i]}`])
                            } else {
                                break
                            }
                        }
                    }
                    if(value.question.type === QuestionType.Multi_Choice) {
                        value.question.rightAnswer = value.question.rightAnswer.split('');
                    }
                    if(value.question.type === QuestionType.Fill_In_Blanks) {
                        value.question.options = value.question.rightAnswer.split(AnswerSeparator)
                    }
                })

                state.questions = res1.examWithQuestions.questions.map((value) => value.question)
                state.userExams = res1.userExams
                state.statistics = res1.statistics

                Object.assign(state.header, res1.examWithQuestions.exam)

                state.userExam.answers = res2.answers
                while(state.questions.length !== state.userExam.answers.length) {
                    state.userExam.answers.push({
                        mark: 0,
                        answer: ''
                    })
                }
                console.log(state)
                state.userExam.userExam = res2.userExam
                state.userExam.userInfo = res2.userInfo

                state.loading = false

            } catch (e) {
                message.error(e)
            }
        } else {
            getExam(examId)
                .then(res => {
                    res.examWithQuestions.questions.forEach((value, index) => {
                        if(value.question.type === QuestionType.Single_Choice || value.question.type === QuestionType.Multi_Choice) {
                            let array = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
                            value.question.options = []
                            for(let i in array) {
                                if(value.question[`option${array[i]}`]) {
                                    value.question.options.push(value.question[`option${array[i]}`])
                                } else {
                                    break
                                }
                            }
                        }
                        if(value.question.type === QuestionType.Multi_Choice) {
                            value.question.rightAnswer = value.question.rightAnswer.split('');
                        }
                        if(value.question.type === QuestionType.Fill_In_Blanks) {
                            value.question.options = value.question.rightAnswer.split(AnswerSeparator)
                        }
                    })

                    state.questions = res.examWithQuestions.questions
                    state.userExams = res.userExams
                    state.statistics = res.statistics

                    Object.assign(state.header, res.examWithQuestions.exam)

                    state.loading = false

                })
                .catch(e => {
                    message.error(e)
                })
        }
    }

    // 学生获得数据
    async function fetchStuData() {
        state.loading = true
        getExam(examId)
            .then(res => {
                state.questions = res.exam.questions;
                Object.assign(state.header, res.exam.exam)
                state.userExam = res.userExam
                if(res.userExam.userExam) {
                    state.questions.forEach((value, index) => {
                        if(!state.userExam.answers[index]) {
                            state.userExam.answers[index] = {}
                        }
                        state.userExam.answers[index].examId = examId
                        state.userExam.answers[index].userId = state.userExam.userExam.userId
                        state.userExam.answers[index].questionId = index + 1
                        state.userExam.answers[index].answer = state.userExam.answers[index].answer || ''
                    })
                }
                state.loading = false
            })
            .catch(e => {
                message.error(e)
            })
    }

    // 添加各种类型的问题
    function addNewQuestion(type: QuestionType): void {
        state.questions.push({
            question: {
                examId: examId,
                questionId: state.questions.length + 1,
                type: type,
                mark: 0,
                optionA: '',
                optionB: '',
                optionC: '',
                optionD: '',
                optionE: '',
                optionF: '',
                optionG: '',
                optionH: '',
                options: ['点击编辑', '点击编辑', '点击编辑', '点击编辑'],
                content: '点击编辑题目题干',
                rightAnswer: '主观题'
            },
            statistics: {}
        })
        if(type===QuestionType.True_False) {
            state.questions[state.questions.length - 1].question.rightAnswer = 'T'
        }
        if(type===QuestionType.Fill_In_Blanks) {
            state.questions[state.questions.length - 1].question.options = ['点击编辑']
        }
    }

    return {
        state,
        addNewQuestion,
        fetchData,
        fetchStuData
    }
}