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
    sectionsPerSemester: number[];
    periodCount: number;
    breaksPerSemester: number[][];
    dayCount: number;
}


export type TeacherSchedulePeriod = [string, string, string, string] | null | [string, string, string] // has 4 elements [sem, sec, subject, roomCode]
export type TeacherScheduleDay = TeacherSchedulePeriod[]
type TeacherScheduleWeek = TeacherScheduleDay[]
export type TeacherSchedule = TeacherScheduleWeek | []


export type Period = [string, string, string] | [null, null, null] // has 3 elements: [Sir, Subject Name, Room Code]
export type Day = Period[] | null
type Week = Day[]
export type TimeTable = Week

export type YearTimeTable = Week[]
export type FullTimeTable = YearTimeTable[]


export type Student = {
    name: string;
    rollNo: string;
    semester: number;
    section: number;
    email: string;
    phoneNumbers?: string;
    address?: string;
    attendance: number;
}

export type Email = {
    subject: string;
    heading: string;
    message: string;
    footer: string;
}

export type ApiData = {
    serviceId: string,
    templateId: string,
    userId: string
}