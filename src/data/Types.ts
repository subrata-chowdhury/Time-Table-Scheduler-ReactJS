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


export type TeacherSchedulePeriod = string[] | null // has 4 elements [sem, sec, subject, roomCode]
export type TeacherScheduleDay = TeacherSchedulePeriod[]
type TeacherScheduleWeek = TeacherScheduleDay[]
export type TeacherSchedule = TeacherScheduleWeek


export type Period = string[] | null[] // has 3 elements: [Sir, Subject Name, Room Code]
export type Day = Period[] | null
type Week = Day[]
export type TimeTable = Week

export type SectionTimeTable = Week[]
export type YearTimeTable = SectionTimeTable[]
export type FullTimeTable = YearTimeTable