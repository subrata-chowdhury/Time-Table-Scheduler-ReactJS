export type Subject = {
    sem: number;
    lectureCount: number;
    isPractical: boolean;
    roomCode: string;
    isFree: boolean;
};


export type Teacher = {
    freeTime: [number, number][] | [];
    subjects: string[];
}

export type TimeTableStructure = {
    semesterCount: number;
    sectionsPerSemester: number[];
    periodCount: number;
    breaksPerSemester: number[][];
}


type TeacherSchedulePeriod = string[] | null // has 4 elements [sem, sec, subject, roomCode]
type TeacherScheduleDay = TeacherSchedulePeriod[]
type TeacherScheduleWeek = TeacherScheduleDay[]
export type TeacherSchedule = TeacherScheduleWeek


type Period = string[] | null[] // has 3 elements: [Sir, Subject Name, Room Code]
type Day = Period[] | null
type Week = Day[]
export type TimeTable = Week[]

export type SectionTimeTable = Week[]
export type YearTimeTable = SectionTimeTable[]
export type FullTimeTable = YearTimeTable[]