import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './entities/settings.entity';
import { Enrollment, EnrollmentStatus } from '../enrollment/entities/enrollment.entity';

@Injectable()
export class FinanceService {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepo: Repository<Settings>,

    @InjectRepository(Enrollment)
    private readonly enrollmentRepo: Repository<Enrollment>,
  ) {}

  // ==========================================
  // ১. STUDENT PART: স্টুডেন্টের সেমিস্টার বিল হিসাব করা
  // ==========================================
  async calculateStudentBill(studentId: number) {
    // ডাটাবেস থেকে গ্লোবাল সেটিংস (id: 1) খুঁজে বের করা
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    if (!settings) {
      throw new NotFoundException('সিস্টেমের গ্লোবাল সেটিংস কনফিগার করা নেই। অনুগ্রহ করে অ্যাডমিনের সাথে যোগাযোগ করুন।');
    }

    // স্টুডেন্টের শুধুমাত্র সক্রিয় (ENROLLED) কোর্স এবং সেকশনগুলো নিয়ে আসা
    const studentEnrollments = await this.enrollmentRepo.find({
      where: {
        studentId: studentId,
        status: EnrollmentStatus.ENROLLED,
      },
      relations: ['section', 'section.course'],
    });

    let totalCredits = 0;
    
    // স্টুডেন্টের নেওয়া কোর্সগুলোর একটি সামারি লিস্ট তৈরি করা
    const enrolledCoursesSummary = studentEnrollments.map((enrollment) => {
      const course = enrollment.section.course;
      totalCredits += Number(course.credits);
      
      return {
        courseCode: course.courseCode,
        courseName: course.name,
        section: enrollment.section.sectionName,
        credits: course.credits,
      };
    });

    // PostgreSQL numeric টাইপ String হিসেবে আসায় একে Number-এ কনভার্ট করা হয়েছে
    const perCreditFee = Number(settings.creditFee);
    const totalTuitionFee = totalCredits * perCreditFee;

    return {
      studentId,
      currentSemester: settings.currentSemester,
      perCreditFee,
      totalCredits,
      totalTuitionFee,
      enrolledCourses: enrolledCoursesSummary,
    };
  }

  // ==========================================
  // ২. ADMIN PART: গ্লোবাল ক্রেডিট ফি ও সেমিস্টার আপডেট করা
  // ==========================================
  async updateGlobalSettings(creditFee?: number, currentSemester?: string) {
    // প্রথমে চেক করা হচ্ছে ডাটাবেসে id: 1 দিয়ে কোনো রো আছে কি না
    let settings = await this.settingsRepo.findOne({ where: { id: 1 } });

    // যদি কোনো ডাটা না থাকে (প্রথমবার রান করার সময়), তবে নতুন একটি রো তৈরি হবে
    if (!settings) {
      settings = this.settingsRepo.create({ id: 1 });
    }

    // ইনপুটে ডাটা পাঠানো হলে সেটি আপডেট হবে, না পাঠালে আগেরটাই থাকবে
    if (creditFee !== undefined) {
      if (creditFee < 0) throw new BadRequestException('ক্রেডিট ফি নেগেটিভ হতে পারবে না');
      settings.creditFee = creditFee;
    }
    
    if (currentSemester !== undefined) {
      settings.currentSemester = currentSemester;
    }

    // ডাটাবেসে সেভ করা এবং রিটার্ন করা
    const updatedSettings = await this.settingsRepo.save(settings);
    
    return {
      message: 'গ্লোবাল ফাইন্যান্স সেটিংস সফলভাবে আপডেট করা হয়েছে',
      settings: updatedSettings,
    };
  }
}