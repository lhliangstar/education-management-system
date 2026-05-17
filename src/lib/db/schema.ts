import { pgTable, serial, varchar, text, timestamp, integer, decimal, boolean, date, primaryKey, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 枚举类型
export const userTypeEnum = pgEnum('user_type', ['校管理员', '产业学院管理员', '评审专家', '部门审核员']);
export const statusEnum = pgEnum('status', ['启用', '禁用', '正常', '异常']);
export const menuTypeEnum = pgEnum('menu_type', ['菜单', '按钮']);
export const noticeTypeEnum = pgEnum('notice_type', ['评估通知', '填报通知', '结果公示', '整改通知']);
export const deptTypeEnum = pgEnum('dept_type', ['职能部门', '二级学院']);
export const collegeStatusEnum = pgEnum('college_status', ['在建', '验收', '期满']);
export const levelTypeEnum = pgEnum('level_type', ['省级产业学院', '校级产业学院']);
export const batchStatusEnum = pgEnum('batch_status', ['未开始', '进行中', '已结束']);
export const checkStatusEnum = pgEnum('check_status', ['未整改', '整改中', '已验收']);
export const memberTypeEnum = pgEnum('member_type', ['校方', '企业', '行业', '政府']);
export const recordTypeEnum = pgEnum('record_type', ['制度文件', '理事会会议', '教指委会议']);
export const baseTypeEnum = pgEnum('base_type', ['校内', '校外']);
export const projectTypeEnum = pgEnum('project_type', ['纵向', '横向', '技术攻关']);
export const evaluateLevelEnum = pgEnum('evaluate_level', ['优秀', '良好', '合格', '不合格']);
export const noticeStatusEnum = pgEnum('notice_status', ['发布', '草稿']);

// ==================== 第一类：系统权限类（3张） ====================

// 1. 用户管理员表
export const sysUser = pgTable('sys_user', {
  userId: serial('user_id').primaryKey(),
  account: varchar('account', { length: 50 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  realName: varchar('real_name', { length: 100 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  deptId: integer('dept_id'),
  roleId: integer('role_id').notNull(),
  userType: userTypeEnum('user_type').notNull(),
  status: statusEnum('status').default('启用'),
  createTime: timestamp('create_time').defaultNow(),
  lastLoginTime: timestamp('last_login_time'),
  remark: text('remark'),
});

// 2. 角色表
export const sysRole = pgTable('sys_role', {
  roleId: serial('role_id').primaryKey(),
  roleName: varchar('role_name', { length: 50 }).notNull(),
  roleCode: varchar('role_code', { length: 50 }).notNull().unique(),
  roleDesc: text('role_desc'),
  createTime: timestamp('create_time').defaultNow(),
});

// 3. 菜单权限表
export const sysPermission = pgTable('sys_permission', {
  permId: serial('perm_id').primaryKey(),
  roleId: integer('role_id').notNull(),
  parentPermId: integer('parent_perm_id'),
  menuName: varchar('menu_name', { length: 100 }).notNull(),
  menuUrl: varchar('menu_url', { length: 255 }),
  menuType: menuTypeEnum('menu_type').default('菜单'),
  sortNum: integer('sort_num').default(0),
});

// ==================== 第二类：学校组织归口类（2张） ====================

// 4. 学校部门表
export const sysDepartment = pgTable('sys_department', {
  deptId: serial('dept_id').primaryKey(),
  deptName: varchar('dept_name', { length: 100 }).notNull(),
  deptType: deptTypeEnum('dept_type').default('职能部门'),
  managerName: varchar('manager_name', { length: 50 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  sortNum: integer('sort_num').default(0),
  status: statusEnum('status').default('正常'),
  createTime: timestamp('create_time').defaultNow(),
});

// 5. 系统通知公告表
export const sysNotice = pgTable('sys_notice', {
  noticeId: serial('notice_id').primaryKey(),
  noticeTitle: varchar('notice_title', { length: 200 }).notNull(),
  noticeType: noticeTypeEnum('notice_type').default('评估通知'),
  publishDept: integer('publish_dept'),
  publishTime: timestamp('publish_time'),
  content: text('content'),
  attachFile: text('attach_file'),
  isTop: boolean('is_top').default(false),
  status: noticeStatusEnum('status').default('发布'),
});

// ==================== 第三类：基础主数据类（5张） ====================

// 6. 公共字典表
export const sysDict = pgTable('sys_dict', {
  dictId: serial('dict_id').primaryKey(),
  dictType: varchar('dict_type', { length: 50 }).notNull(),
  dictLabel: varchar('dict_label', { length: 100 }).notNull(),
  dictValue: varchar('dict_value', { length: 100 }).notNull(),
  sortNum: integer('sort_num').default(0),
  remark: text('remark'),
});

// 7. 产业学院基本信息表
export const industryCollege = pgTable('industry_college', {
  collegeId: serial('college_id').primaryKey(),
  collegeName: varchar('college_name', { length: 200 }).notNull(),
  deptId: integer('dept_id'),
  industryChain: varchar('industry_chain', { length: 200 }),
  establishTime: date('establish_time'),
  directorName: varchar('director_name', { length: 50 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  address: varchar('address', { length: 255 }),
  planFileNo: varchar('plan_file_no', { length: 100 }),
  status: collegeStatusEnum('status').default('在建'),
  remark: text('remark'),
});

// 8. 产业学院等级认定表
export const collegeLevel = pgTable('college_level', {
  levelId: serial('level_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  levelType: levelTypeEnum('level_type').notNull(),
  approveNo: varchar('approve_no', { length: 100 }),
  approveTime: date('approve_time'),
  startTime: date('start_time'),
  endTime: date('end_time'),
  isValid: boolean('is_valid').default(true),
  remark: text('remark'),
});

// 9. 合作企业信息表
export const coopEnterprise = pgTable('coop_enterprise', {
  enterpriseId: serial('enterprise_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  enterpriseName: varchar('enterprise_name', { length: 200 }).notNull(),
  enterpriseType: varchar('enterprise_type', { length: 50 }),
  isLeader: boolean('is_leader').default(false),
  industryCategory: varchar('industry_category', { length: 100 }),
  coopStartTime: date('coop_start_time'),
  coopMode: varchar('coop_mode', { length: 50 }),
  contactPerson: varchar('contact_person', { length: 50 }),
  contactPhone: varchar('contact_phone', { length: 20 }),
  coopDepth: varchar('coop_depth', { length: 20 }).default('一般'),
});

// 10. 专业群对接信息表
export const majorGroup = pgTable('major_group', {
  majorId: serial('major_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  groupName: varchar('group_name', { length: 100 }).notNull(),
  majorName: varchar('major_name', { length: 100 }).notNull(),
  majorCode: varchar('major_code', { length: 20 }),
  recruitScale: integer('recruit_scale'),
  trainPosition: varchar('train_position', { length: 255 }),
  adjustRecord: text('adjust_record'),
});

// ==================== 第四类：治理运行类（2张） ====================

// 11. 理事会管委会成员表
export const councilMember = pgTable('council_member', {
  memberId: serial('member_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  unit: varchar('unit', { length: 100 }),
  post: varchar('post', { length: 50 }),
  memberType: memberTypeEnum('member_type').notNull(),
  termStart: date('term_start'),
  termEnd: date('term_end'),
  remark: text('remark'),
});

// 12. 制度与会议记录表
export const systemMeeting = pgTable('system_meeting', {
  recordId: serial('record_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  recordType: recordTypeEnum('record_type').notNull(),
  fileName: varchar('file_name', { length: 200 }).notNull(),
  issueDept: varchar('issue_dept', { length: 100 }),
  releaseTime: date('release_time'),
  content: text('content'),
  signRecord: text('sign_record'),
  attachFile: text('attach_file'),
});

// ==================== 第五类：业务核心类（9张） ====================

// 13. 经费投入明细表
export const fundInvest = pgTable('fund_invest', {
  fundId: serial('fund_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  year: integer('year').notNull(),
  schoolFund: decimal('school_fund', { precision: 15, scale: 2 }).default('0'),
  governmentFund: decimal('government_fund', { precision: 15, scale: 2 }).default('0'),
  enterpriseFund: decimal('enterprise_fund', { precision: 15, scale: 2 }).default('0'),
  fundUse: text('fund_use'),
  executionRate: decimal('execution_rate', { precision: 5, scale: 2 }).default('0'),
  voucherFile: text('voucher_file'),
});

// 14. 实训基地场地设备表
export const trainingBase = pgTable('training_base', {
  baseId: serial('base_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  baseName: varchar('base_name', { length: 200 }).notNull(),
  baseType: baseTypeEnum('base_type').default('校内'),
  coopUnit: varchar('coop_unit', { length: 200 }),
  area: decimal('area', { precision: 10, scale: 2 }),
  equipmentSet: integer('equipment_set'),
  equipmentValue: decimal('equipment_value', { precision: 15, scale: 2 }),
  intactRate: decimal('intact_rate', { precision: 5, scale: 2 }).default('100'),
  useRate: decimal('use_rate', { precision: 5, scale: 2 }).default('0'),
  practiceProjectNum: integer('practice_project_num').default(0),
});

// 15. 图书与信息化资源表
export const infoResource = pgTable('info_resource', {
  resourceId: serial('resource_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  bookNum: integer('book_num').default(0),
  electronicResource: text('electronic_resource'),
  onlineCourseNum: integer('online_course_num').default(0),
  caseResourceNum: integer('case_resource_num').default(0),
});

// 16. 人才培养方案表
export const trainPlan = pgTable('train_plan', {
  planId: serial('plan_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  majorId: integer('major_id'),
  planYear: integer('plan_year').notNull(),
  isCoopCompile: boolean('is_coop_compile').default(false),
  practiceClassRatio: decimal('practice_class_ratio', { precision: 5, scale: 2 }).default('0'),
  postCourseCert: text('post_course_cert'),
  internshipTime: integer('internship_time'),
  featureDesc: text('feature_desc'),
});

// 17. 课程与教材建设表
export const courseTextbook = pgTable('course_textbook', {
  ctId: serial('ct_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  courseName: varchar('course_name', { length: 200 }).notNull(),
  courseType: varchar('course_type', { length: 50 }),
  textbookName: varchar('textbook_name', { length: 200 }),
  textbookType: varchar('textbook_type', { length: 50 }),
  enterpriseEditor: boolean('enterprise_editor').default(false),
  awardLevel: varchar('award_level', { length: 50 }),
});

// 18. 学生培养过程统计表
export const studentTrain = pgTable('student_train', {
  studentId: serial('student_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  year: integer('year').notNull(),
  recruitNum: integer('recruit_num').default(0),
  schoolNum: integer('school_num').default(0),
  internshipNum: integer('internship_num').default(0),
  certificateNum: integer('certificate_num').default(0),
  competitionAwardNum: integer('competition_award_num').default(0),
});

// 19. 专任教师信息表
export const fullTeacher = pgTable('full_teacher', {
  teacherId: serial('teacher_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  name: varchar('name', { length: 50 }).notNull(),
  title: varchar('title', { length: 50 }),
  isDoubleTeacher: boolean('is_double_teacher').default(false),
  education: varchar('education', { length: 50 }),
  enterprisePracticeTime: integer('enterprise_practice_time').default(0),
  teachCourse: text('teach_course'),
  researchAchievement: text('research_achievement'),
});

// 20. 企业兼职教师表
export const partTeacher = pgTable('part_teacher', {
  ptId: serial('pt_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  enterpriseId: integer('enterprise_id'),
  name: varchar('name', { length: 50 }).notNull(),
  enterprisePost: varchar('enterprise_post', { length: 50 }),
  skillLevel: varchar('skill_level', { length: 50 }),
  teachHour: integer('teach_hour').default(0),
  guidePracticeNum: integer('guide_practice_num').default(0),
});

// 21. 科研与社会服务表
export const researchService = pgTable('research_service', {
  rsId: serial('rs_id').primaryKey(),
  collegeId: integer('college_id').notNull(),
  projectName: varchar('project_name', { length: 200 }).notNull(),
  projectType: projectTypeEnum('project_type'),
  patentNum: integer('patent_num').default(0),
  platformName: varchar('platform_name', { length: 200 }),
  trainSession: integer('train_session').default(0),
  trainPerson: integer('train_person').default(0),
  serviceDesc: text('service_desc'),
});

// ==================== 第六类：评估管理类（3张） ====================

// 22. 评估批次表
export const evaluateBatch = pgTable('evaluate_batch', {
  batchId: serial('batch_id').primaryKey(),
  batchName: varchar('batch_name', { length: 200 }).notNull(),
  evaluateYear: integer('evaluate_year').notNull(),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  reviewTime: timestamp('review_time'),
  publishTime: timestamp('publish_time'),
  status: batchStatusEnum('status').default('未开始'),
  createDept: integer('create_dept'),
});

// 23. 评估指标字典表
export const evaluateIndex = pgTable('evaluate_index', {
  indexId: serial('index_id').primaryKey(),
  firstIndex: varchar('first_index', { length: 100 }).notNull(),
  secondIndex: varchar('second_index', { length: 200 }).notNull(),
  weight: decimal('weight', { precision: 5, scale: 2 }).notNull(),
  scoreStandard: text('score_standard'),
  observePoint: text('observe_point'),
  dataSource: varchar('data_source', { length: 100 }),
  sortNum: integer('sort_num').default(0),
});

// 24. 佐证材料关联表
export const evidenceFile = pgTable('evidence_file', {
  fileId: serial('file_id').primaryKey(),
  batchId: integer('batch_id').notNull(),
  indexId: integer('index_id'),
  relationId: integer('relation_id'),
  collegeId: integer('college_id').notNull(),
  fileName: varchar('file_name', { length: 200 }).notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  uploadTime: timestamp('upload_time').defaultNow(),
  uploadUser: integer('upload_user'),
});

// ==================== 第七类：归档整改类（2张） ====================

// 25. 年度评估归档表
export const evaluateArchive = pgTable('evaluate_archive', {
  archiveId: serial('archive_id').primaryKey(),
  batchId: integer('batch_id').notNull(),
  collegeId: integer('college_id').notNull(),
  evaluateYear: integer('evaluate_year').notNull(),
  totalScore: decimal('total_score', { precision: 6, scale: 2 }),
  evaluateLevel: evaluateLevelEnum('evaluate_level'),
  expertOpinion: text('expert_opinion'),
  rectifyRequire: text('rectify_require'),
  archiveTime: timestamp('archive_time').defaultNow(),
  reviewExpert: varchar('review_expert', { length: 200 }),
});

// 26. 评估问题整改记录表
export const rectifyRecord = pgTable('rectify_record', {
  rectifyId: serial('rectify_id').primaryKey(),
  batchId: integer('batch_id').notNull(),
  collegeId: integer('college_id').notNull(),
  indexId: integer('index_id'),
  problemDesc: text('problem_desc').notNull(),
  rectifyMeasure: text('rectify_measure'),
  planFinishTime: date('plan_finish_time'),
  actualFinishTime: date('actual_finish_time'),
  rectifyFile: text('rectify_file'),
  checkStatus: checkStatusEnum('check_status').default('未整改'),
  checkOpinion: text('check_opinion'),
  checkUser: integer('check_user'),
});

// ==================== 关系定义 ====================

export const sysUserRelations = relations(sysUser, ({ one }) => ({
  department: one(sysDepartment, {
    fields: [sysUser.deptId],
    references: [sysDepartment.deptId],
  }),
  role: one(sysRole, {
    fields: [sysUser.roleId],
    references: [sysRole.roleId],
  }),
}));

export const industryCollegeRelations = relations(industryCollege, ({ one, many }) => ({
  department: one(sysDepartment, {
    fields: [industryCollege.deptId],
    references: [sysDepartment.deptId],
  }),
  levels: many(collegeLevel),
  enterprises: many(coopEnterprise),
  majors: many(majorGroup),
  members: many(councilMember),
  meetings: many(systemMeeting),
  funds: many(fundInvest),
  bases: many(trainingBase),
  resources: many(infoResource),
  trainPlans: many(trainPlan),
  courses: many(courseTextbook),
  students: many(studentTrain),
  fullTeachers: many(fullTeacher),
  partTeachers: many(partTeacher),
  researches: many(researchService),
  archives: many(evaluateArchive),
  rectifyRecords: many(rectifyRecord),
}));
