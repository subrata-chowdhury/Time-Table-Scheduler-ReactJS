export type Subject = {
    sem: number;
    lectureCount: number;
    isPractical: boolean;
    roomCodes: string[];
    isFree: boolean;
};


export type Teacher = {
    freeTime: [number, number][] | [];
    subjects: string[];
}

export type TimeTableStructure = {
    semesterCount: number;
    sectionsPerSemester: [number, number, number, number];
    periodCount: number;
    breaksPerSemester: [number[], number[], number[], number[]];
}


export type TeacherSchedulePeriod = [string, string, string, string] | null | [string, string, string] // has 4 elements [sem, sec, subject, roomCode]
export type TeacherScheduleDay = TeacherSchedulePeriod[]
type TeacherScheduleWeek = [TeacherScheduleDay, TeacherScheduleDay, TeacherScheduleDay, TeacherScheduleDay, TeacherScheduleDay]
export type TeacherSchedule = TeacherScheduleWeek | []


export type Period = [string, string, string] | [null, null, null] // has 3 elements: [Sir, Subject Name, Room Code]
export type Day = Period[] | null
type Week = [Day, Day, Day, Day, Day]
export type TimeTable = Week

export type SectionTimeTable = Week[]
export type YearTimeTable = SectionTimeTable[]
export type FullTimeTable = YearTimeTable