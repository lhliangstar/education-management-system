-- ============================================
-- 产业学院质量监控与智能评估管理系统
-- 数据库设计文档 v1.0
-- 包含26张核心表
-- ============================================

-- 第一类：系统权限类（3张）
-- 1. 用户管理员表
CREATE TABLE sys_user (
    user_id SERIAL PRIMARY KEY,
    account VARCHAR(50) NOT NULL UNIQUE COMMENT '登录账号',
    password VARCHAR(255) NOT NULL COMMENT '登录密码（加密存储）',
    real_name VARCHAR(100) NOT NULL COMMENT '真实姓名',
    phone VARCHAR(20) COMMENT '手机号',
    dept_id INTEGER COMMENT '所属部门ID',
    role_id INTEGER NOT NULL COMMENT '关联角色ID',
    user_type VARCHAR(20) NOT NULL COMMENT '用户类型：校管理员/产业学院管理员/评审专家/部门审核员',
    status VARCHAR(10) DEFAULT '启用' COMMENT '启用/禁用',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    last_login_time TIMESTAMP COMMENT '最后登录时间',
    remark TEXT COMMENT '备注',
    CONSTRAINT fk_user_dept FOREIGN KEY (dept_id) REFERENCES sys_department(dept_id),
    CONSTRAINT fk_user_role FOREIGN KEY (role_id) REFERENCES sys_role(role_id)
);
CREATE INDEX idx_user_account ON sys_user(account);
CREATE INDEX idx_user_dept ON sys_user(dept_id);
CREATE INDEX idx_user_role ON sys_user(role_id);

-- 2. 角色表
CREATE TABLE sys_role (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL COMMENT '角色名称',
    role_code VARCHAR(50) NOT NULL UNIQUE COMMENT '角色编码',
    role_desc TEXT COMMENT '角色描述',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);

-- 3. 菜单权限表
CREATE TABLE sys_permission (
    perm_id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL COMMENT '角色ID',
    parent_perm_id INTEGER COMMENT '上级权限ID',
    menu_name VARCHAR(100) NOT NULL COMMENT '菜单名称',
    menu_url VARCHAR(255) COMMENT '访问地址',
    menu_type VARCHAR(20) DEFAULT '菜单' COMMENT '菜单/按钮',
    sort_num INTEGER DEFAULT 0 COMMENT '排序',
    CONSTRAINT fk_perm_role FOREIGN KEY (role_id) REFERENCES sys_role(role_id),
    CONSTRAINT fk_perm_parent FOREIGN KEY (parent_perm_id) REFERENCES sys_permission(perm_id)
);
CREATE INDEX idx_perm_role ON sys_permission(role_id);

-- 第二类：学校组织归口类（2张）
-- 4. 学校部门表
CREATE TABLE sys_department (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL COMMENT '部门名称',
    dept_type VARCHAR(20) DEFAULT '职能部门' COMMENT '职能部门/二级学院',
    manager_name VARCHAR(50) COMMENT '部门负责人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    sort_num INTEGER DEFAULT 0 COMMENT '排序',
    status VARCHAR(10) DEFAULT '正常' COMMENT '状态',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);
CREATE INDEX idx_dept_type ON sys_department(dept_type);

-- 5. 系统通知公告表
CREATE TABLE sys_notice (
    notice_id SERIAL PRIMARY KEY,
    notice_title VARCHAR(200) NOT NULL COMMENT '公告标题',
    notice_type VARCHAR(20) DEFAULT '评估通知' COMMENT '评估通知/填报通知/结果公示/整改通知',
    publish_dept INTEGER COMMENT '发布部门ID',
    publish_time TIMESTAMP COMMENT '发布时间',
    content TEXT COMMENT '公告内容',
    attach_file TEXT COMMENT '附件（JSON数组存储）',
    is_top BOOLEAN DEFAULT FALSE COMMENT '是否置顶',
    status VARCHAR(10) DEFAULT '发布' COMMENT '发布/草稿',
    CONSTRAINT fk_notice_dept FOREIGN KEY (publish_dept) REFERENCES sys_department(dept_id)
);
CREATE INDEX idx_notice_type ON sys_notice(notice_type);
CREATE INDEX idx_notice_publish ON sys_notice(publish_time DESC);

-- 第三类：基础主数据类（5张）
-- 6. 公共字典表
CREATE TABLE sys_dict (
    dict_id SERIAL PRIMARY KEY,
    dict_type VARCHAR(50) NOT NULL COMMENT '字典类型',
    dict_label VARCHAR(100) NOT NULL COMMENT '字典显示名称',
    dict_value VARCHAR(100) NOT NULL COMMENT '字典值',
    sort_num INTEGER DEFAULT 0 COMMENT '排序号',
    remark TEXT COMMENT '备注'
);
CREATE INDEX idx_dict_type ON sys_dict(dict_type);

-- 7. 产业学院基本信息表
CREATE TABLE industry_college (
    college_id SERIAL PRIMARY KEY,
    college_name VARCHAR(200) NOT NULL COMMENT '产业学院名称',
    dept_id INTEGER COMMENT '归口管理部门ID',
    industry_chain VARCHAR(200) COMMENT '对接产业链/产业集群',
    establish_time DATE COMMENT '成立时间',
    director_name VARCHAR(50) COMMENT '负责人',
    contact_phone VARCHAR(20) COMMENT '负责人电话',
    address VARCHAR(255) COMMENT '办公场地',
    plan_file_no VARCHAR(100) COMMENT '建设规划文号',
    status VARCHAR(20) DEFAULT '在建' COMMENT '在建/验收/期满',
    remark TEXT COMMENT '备注',
    CONSTRAINT fk_college_dept FOREIGN KEY (dept_id) REFERENCES sys_department(dept_id)
);
CREATE INDEX idx_college_dept ON industry_college(dept_id);
CREATE INDEX idx_college_status ON industry_college(status);

-- 8. 产业学院等级认定表
CREATE TABLE college_level (
    level_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    level_type VARCHAR(50) NOT NULL COMMENT '省级产业学院/校级产业学院',
    approve_no VARCHAR(100) COMMENT '认定文号',
    approve_time DATE COMMENT '认定时间',
    start_time DATE COMMENT '建设起始时间',
    end_time DATE COMMENT '建设到期时间',
    is_valid BOOLEAN DEFAULT TRUE COMMENT '是否有效',
    remark TEXT COMMENT '备注',
    CONSTRAINT fk_level_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_level_college ON college_level(college_id);
CREATE INDEX idx_level_type ON college_level(level_type);

-- 9. 合作企业信息表
CREATE TABLE coop_enterprise (
    enterprise_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '所属产业学院ID',
    enterprise_name VARCHAR(200) NOT NULL COMMENT '企业名称',
    enterprise_type VARCHAR(50) COMMENT '企业性质',
    is_leader BOOLEAN DEFAULT FALSE COMMENT '是否链主龙头',
    industry_category VARCHAR(100) COMMENT '行业类别',
    coop_start_time DATE COMMENT '合作起始时间',
    coop_mode VARCHAR(50) COMMENT '合作模式',
    contact_person VARCHAR(50) COMMENT '联系人',
    contact_phone VARCHAR(20) COMMENT '联系电话',
    coop_depth VARCHAR(20) DEFAULT '一般' COMMENT '合作深度等级',
    CONSTRAINT fk_enterprise_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_enterprise_college ON coop_enterprise(college_id);
CREATE INDEX idx_enterprise_leader ON coop_enterprise(is_leader);

-- 10. 专业群对接信息表
CREATE TABLE major_group (
    major_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    group_name VARCHAR(100) NOT NULL COMMENT '专业群名称',
    major_name VARCHAR(100) NOT NULL COMMENT '专业名称',
    major_code VARCHAR(20) COMMENT '专业代码',
    recruit_scale INTEGER COMMENT '年度招生规模',
    train_position VARCHAR(255) COMMENT '对应岗位群',
    adjust_record TEXT COMMENT '专业动态调整记录',
    CONSTRAINT fk_major_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_major_college ON major_group(college_id);

-- 第四类：治理运行类（2张）
-- 11. 理事会管委会成员表
CREATE TABLE council_member (
    member_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    unit VARCHAR(100) COMMENT '所属单位',
    post VARCHAR(50) COMMENT '职务',
    member_type VARCHAR(20) NOT NULL COMMENT '校方/企业/行业/政府',
    term_start DATE COMMENT '任职开始',
    term_end DATE COMMENT '任职结束',
    remark TEXT COMMENT '备注',
    CONSTRAINT fk_member_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_council_college ON council_member(college_id);
CREATE INDEX idx_council_type ON council_member(member_type);

-- 12. 制度与会议记录表
CREATE TABLE system_meeting (
    record_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    record_type VARCHAR(50) NOT NULL COMMENT '制度文件/理事会会议/教指委会议',
    file_name VARCHAR(200) NOT NULL COMMENT '主题/制度名',
    issue_dept VARCHAR(100) COMMENT '主办部门',
    release_time DATE COMMENT '发布/会议时间',
    content TEXT COMMENT '纪要/制度内容',
    sign_record TEXT COMMENT '签到记录（JSON）',
    attach_file TEXT COMMENT '附件（JSON数组）',
    CONSTRAINT fk_meeting_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_meeting_college ON system_meeting(college_id);
CREATE INDEX idx_meeting_type ON system_meeting(record_type);

-- 第五类：业务核心类（9张）
-- 13. 经费投入明细表
CREATE TABLE fund_invest (
    fund_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    year INTEGER NOT NULL COMMENT '统计年度',
    school_fund DECIMAL(15,2) DEFAULT 0 COMMENT '学校投入',
    government_fund DECIMAL(15,2) DEFAULT 0 COMMENT '政府专项',
    enterprise_fund DECIMAL(15,2) DEFAULT 0 COMMENT '企业投入',
    fund_use TEXT COMMENT '经费用途',
    execution_rate DECIMAL(5,2) DEFAULT 0 COMMENT '执行率(%)',
    voucher_file TEXT COMMENT '凭证附件（JSON数组）',
    CONSTRAINT fk_fund_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_fund_college_year ON fund_invest(college_id, year);

-- 14. 实训基地场地设备表
CREATE TABLE training_base (
    base_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    base_name VARCHAR(200) NOT NULL COMMENT '基地名称',
    base_type VARCHAR(20) DEFAULT '校内' COMMENT '校内/校外',
    coop_unit VARCHAR(200) COMMENT '共建单位',
    area DECIMAL(10,2) COMMENT '场地面积（平方米）',
    equipment_set INTEGER COMMENT '设备台套',
    equipment_value DECIMAL(15,2) COMMENT '设备总值（万元）',
    intact_rate DECIMAL(5,2) DEFAULT 100 COMMENT '完好率(%)',
    use_rate DECIMAL(5,2) DEFAULT 0 COMMENT '年利用率(%)',
    practice_project_num INTEGER DEFAULT 0 COMMENT '生产性实训项目数',
    CONSTRAINT fk_base_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_base_college ON training_base(college_id);
CREATE INDEX idx_base_type ON training_base(base_type);

-- 15. 图书与信息化资源表
CREATE TABLE info_resource (
    resource_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    book_num INTEGER DEFAULT 0 COMMENT '专业图书量（册）',
    electronic_resource TEXT COMMENT '电子资源（JSON）',
    online_course_num INTEGER DEFAULT 0 COMMENT '在线课程数',
    case_resource_num INTEGER DEFAULT 0 COMMENT '产业案例资源条数',
    CONSTRAINT fk_resource_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX idx_resource_unique ON info_resource(college_id);

-- 16. 人才培养方案表
CREATE TABLE train_plan (
    plan_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    major_id INTEGER COMMENT '专业ID',
    plan_year INTEGER NOT NULL COMMENT '方案年份',
    is_coop_compile BOOLEAN DEFAULT FALSE COMMENT '是否校企共建',
    practice_class_ratio DECIMAL(5,2) DEFAULT 0 COMMENT '实践课时占比(%)',
    post_course_cert TEXT COMMENT '岗课赛证融合（JSON）',
    internship_time INTEGER COMMENT '实习时长（周）',
    feature_desc TEXT COMMENT '培养特色',
    CONSTRAINT fk_plan_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE,
    CONSTRAINT fk_plan_major FOREIGN KEY (major_id) REFERENCES major_group(major_id)
);
CREATE INDEX idx_plan_college ON train_plan(college_id);
CREATE INDEX idx_plan_year ON train_plan(plan_year);

-- 17. 课程与教材建设表
CREATE TABLE course_textbook (
    ct_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    course_name VARCHAR(200) NOT NULL COMMENT '课程名称',
    course_type VARCHAR(50) COMMENT '产教融合核心课/共建课',
    textbook_name VARCHAR(200) COMMENT '教材名称',
    textbook_type VARCHAR(50) COMMENT '活页式/项目式',
    enterprise_editor BOOLEAN DEFAULT FALSE COMMENT '是否有企业参编',
    award_level VARCHAR(50) COMMENT '获奖级别',
    CONSTRAINT fk_ct_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_ct_college ON course_textbook(college_id);
CREATE INDEX idx_ct_type ON course_textbook(course_type);

-- 18. 学生培养过程统计表
CREATE TABLE student_train (
    student_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    year INTEGER NOT NULL COMMENT '年度',
    recruit_num INTEGER DEFAULT 0 COMMENT '招生数',
    school_num INTEGER DEFAULT 0 COMMENT '在校生',
    internship_num INTEGER DEFAULT 0 COMMENT '实习人数',
    certificate_num INTEGER DEFAULT 0 COMMENT '证书获取人数',
    competition_award_num INTEGER DEFAULT 0 COMMENT '大赛获奖人次',
    CONSTRAINT fk_student_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_student_college_year ON student_train(college_id, year);

-- 19. 专任教师信息表
CREATE TABLE full_teacher (
    teacher_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    title VARCHAR(50) COMMENT '职称',
    is_double_teacher BOOLEAN DEFAULT FALSE COMMENT '是否双师双能',
    education VARCHAR(50) COMMENT '学历学位',
    enterprise_practice_time INTEGER DEFAULT 0 COMMENT '企业实践时长（天/年）',
    teach_course TEXT COMMENT '主讲课程（JSON数组）',
    research_achievement TEXT COMMENT '教研成果（JSON）',
    CONSTRAINT fk_teacher_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_teacher_college ON full_teacher(college_id);
CREATE INDEX idx_teacher_double ON full_teacher(is_double_teacher);

-- 20. 企业兼职教师表
CREATE TABLE part_teacher (
    pt_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    enterprise_id INTEGER COMMENT '企业ID',
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    enterprise_post VARCHAR(50) COMMENT '企业职务',
    skill_level VARCHAR(50) COMMENT '技能等级',
    teach_hour INTEGER DEFAULT 0 COMMENT '授课学时',
    guide_practice_num INTEGER DEFAULT 0 COMMENT '指导实训次数',
    CONSTRAINT fk_pt_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE,
    CONSTRAINT fk_pt_enterprise FOREIGN KEY (enterprise_id) REFERENCES coop_enterprise(enterprise_id)
);
CREATE INDEX idx_pt_college ON part_teacher(college_id);
CREATE INDEX idx_pt_enterprise ON part_teacher(enterprise_id);

-- 21. 科研与社会服务表
CREATE TABLE research_service (
    rs_id SERIAL PRIMARY KEY,
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    project_name VARCHAR(200) NOT NULL COMMENT '项目名称',
    project_type VARCHAR(50) COMMENT '纵向/横向/技术攻关',
    patent_num INTEGER DEFAULT 0 COMMENT '专利软著数',
    platform_name VARCHAR(200) COMMENT '共建创新平台',
    train_session INTEGER DEFAULT 0 COMMENT '培训场次',
    train_person INTEGER DEFAULT 0 COMMENT '培训人数',
    service_desc TEXT COMMENT '技术咨询服务',
    CONSTRAINT fk_rs_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE
);
CREATE INDEX idx_rs_college ON research_service(college_id);
CREATE INDEX idx_rs_type ON research_service(project_type);

-- 第六类：评估管理类（3张）
-- 22. 评估批次表
CREATE TABLE evaluate_batch (
    batch_id SERIAL PRIMARY KEY,
    batch_name VARCHAR(200) NOT NULL COMMENT '评估批次名称',
    evaluate_year INTEGER NOT NULL COMMENT '评估年度',
    start_time TIMESTAMP NOT NULL COMMENT '填报开始时间',
    end_time TIMESTAMP NOT NULL COMMENT '填报截止时间',
    review_time TIMESTAMP COMMENT '专家评审时间',
    publish_time TIMESTAMP COMMENT '结果公示时间',
    status VARCHAR(20) DEFAULT '未开始' COMMENT '未开始/进行中/已结束',
    create_dept INTEGER COMMENT '发起部门ID',
    CONSTRAINT fk_batch_dept FOREIGN KEY (create_dept) REFERENCES sys_department(dept_id)
);
CREATE INDEX idx_batch_year ON evaluate_batch(evaluate_year DESC);
CREATE INDEX idx_batch_status ON evaluate_batch(status);

-- 23. 评估指标字典表
CREATE TABLE evaluate_index (
    index_id SERIAL PRIMARY KEY,
    first_index VARCHAR(100) NOT NULL COMMENT '一级指标',
    second_index VARCHAR(200) NOT NULL COMMENT '二级指标',
    weight DECIMAL(5,2) NOT NULL COMMENT '指标权重',
    score_standard TEXT COMMENT '评分标准',
    observe_point TEXT COMMENT '核查观测点',
    data_source VARCHAR(100) COMMENT '对应业务表',
    sort_num INTEGER DEFAULT 0 COMMENT '排序'
);
CREATE INDEX idx_index_first ON evaluate_index(first_index);

-- 24. 佐证材料关联表
CREATE TABLE evidence_file (
    file_id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL COMMENT '评估批次ID',
    index_id INTEGER COMMENT '评估指标ID',
    relation_id INTEGER COMMENT '关联业务数据ID',
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    file_name VARCHAR(200) NOT NULL COMMENT '材料名称',
    file_path VARCHAR(500) NOT NULL COMMENT '存储路径',
    upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
    upload_user INTEGER COMMENT '上传人ID',
    CONSTRAINT fk_evidence_batch FOREIGN KEY (batch_id) REFERENCES evaluate_batch(batch_id) ON DELETE CASCADE,
    CONSTRAINT fk_evidence_index FOREIGN KEY (index_id) REFERENCES evaluate_index(index_id),
    CONSTRAINT fk_evidence_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE,
    CONSTRAINT fk_evidence_user FOREIGN KEY (upload_user) REFERENCES sys_user(user_id)
);
CREATE INDEX idx_evidence_batch ON evidence_file(batch_id);
CREATE INDEX idx_evidence_college ON evidence_file(college_id);
CREATE INDEX idx_evidence_index ON evidence_file(index_id);

-- 第七类：归档整改类（2张）
-- 25. 年度评估归档表
CREATE TABLE evaluate_archive (
    archive_id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL COMMENT '评估批次ID',
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    evaluate_year INTEGER NOT NULL COMMENT '评估年度',
    total_score DECIMAL(6,2) COMMENT '总分',
    evaluate_level VARCHAR(20) COMMENT '优秀/良好/合格/不合格',
    expert_opinion TEXT COMMENT '专家意见',
    rectify_require TEXT COMMENT '整改要求',
    archive_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '归档时间',
    review_expert VARCHAR(200) COMMENT '评审专家（JSON数组）',
    CONSTRAINT fk_archive_batch FOREIGN KEY (batch_id) REFERENCES evaluate_batch(batch_id),
    CONSTRAINT fk_archive_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id)
);
CREATE INDEX idx_archive_batch ON evaluate_archive(batch_id);
CREATE INDEX idx_archive_college ON evaluate_archive(college_id);
CREATE INDEX idx_archive_level ON evaluate_archive(evaluate_level);

-- 26. 评估问题整改记录表
CREATE TABLE rectify_record (
    rectify_id SERIAL PRIMARY KEY,
    batch_id INTEGER NOT NULL COMMENT '评估批次ID',
    college_id INTEGER NOT NULL COMMENT '产业学院ID',
    index_id INTEGER COMMENT '关联指标ID',
    problem_desc TEXT NOT NULL COMMENT '存在问题描述',
    rectify_measure TEXT COMMENT '整改措施',
    plan_finish_time DATE COMMENT '计划完成时间',
    actual_finish_time DATE COMMENT '实际完成时间',
    rectify_file TEXT COMMENT '整改佐证材料（JSON数组）',
    check_status VARCHAR(20) DEFAULT '未整改' COMMENT '未整改/整改中/已验收',
    check_opinion TEXT COMMENT '学校审核意见',
    check_user INTEGER COMMENT '审核人ID',
    CONSTRAINT fk_rectify_batch FOREIGN KEY (batch_id) REFERENCES evaluate_batch(batch_id) ON DELETE CASCADE,
    CONSTRAINT fk_rectify_college FOREIGN KEY (college_id) REFERENCES industry_college(college_id) ON DELETE CASCADE,
    CONSTRAINT fk_rectify_index FOREIGN KEY (index_id) REFERENCES evaluate_index(index_id),
    CONSTRAINT fk_rectify_user FOREIGN KEY (check_user) REFERENCES sys_user(user_id)
);
CREATE INDEX idx_rectify_batch ON rectify_record(batch_id);
CREATE INDEX idx_rectify_college ON rectify_record(college_id);
CREATE INDEX idx_rectify_status ON rectify_record(check_status);

-- ============================================
-- 初始化数据
-- ============================================

-- 插入默认角色
INSERT INTO sys_role (role_name, role_code, role_desc) VALUES
('超级管理员', 'SUPER_ADMIN', '系统超级管理员，拥有所有权限'),
('校管理员', 'SCHOOL_ADMIN', '学校层面管理员'),
('产业学院管理员', 'COLLEGE_ADMIN', '产业学院管理员'),
('评审专家', 'EXPERT', '评估评审专家'),
('部门审核员', 'DEPT_AUDITOR', '部门审核人员');

-- 插入公共字典数据
INSERT INTO sys_dict (dict_type, dict_label, dict_value, sort_num) VALUES
('user_type', '校管理员', '校管理员', 1),
('user_type', '产业学院管理员', '产业学院管理员', 2),
('user_type', '评审专家', '评审专家', 3),
('user_type', '部门审核员', '部门审核员', 4),
('college_status', '在建', '在建', 1),
('college_status', '验收', '验收', 2),
('college_status', '期满', '期满', 3),
('level_type', '省级产业学院', '省级产业学院', 1),
('level_type', '校级产业学院', '校级产业学院', 2),
('notice_type', '评估通知', '评估通知', 1),
('notice_type', '填报通知', '填报通知', 2),
('notice_type', '结果公示', '结果公示', 3),
('notice_type', '整改通知', '整改通知', 4),
('batch_status', '未开始', '未开始', 1),
('batch_status', '进行中', '进行中', 2),
('batch_status', '已结束', '已结束', 3),
('check_status', '未整改', '未整改', 1),
('check_status', '整改中', '整改中', 2),
('check_status', '已验收', '已验收', 3);

-- 插入默认部门
INSERT INTO sys_department (dept_name, dept_type, manager_name, contact_phone, sort_num) VALUES
('教务处', '职能部门', '张三', '010-12345678', 1),
('产教融合处', '职能部门', '李四', '010-23456789', 2),
('质量监控处', '职能部门', '王五', '010-34567890', 3),
('人事处', '职能部门', '赵六', '010-45678901', 4),
('财务处', '职能部门', '钱七', '010-56789012', 5);

-- 插入默认系统管理员
INSERT INTO sys_user (account, password, real_name, phone, role_id, user_type, status) VALUES
('admin', '$2b$10$abcdefghijklmnopqrstuv', '系统管理员', '13800138000', 1, '校管理员', '启用');

-- 插入评估指标示例
INSERT INTO evaluate_index (first_index, second_index, weight, score_standard, observe_point, sort_num) VALUES
('一、治理结构', '1.1 理事会/管委会运作', 10.00, '理事会正常运行，得10分；未正常运作，酌情扣分', '查看理事会会议记录、签到表', 1),
('一、治理结构', '1.2 制度建设', 5.00, '制度完善，得5分；基本完善得3分；不完善得1分', '查看制度文件汇编', 2),
('二、人才培养', '2.1 招生与培养规模', 10.00, '完成招生计划，得10分；未完成按比例扣分', '查看招生数据统计', 3),
('二、人才培养', '2.2 课程与教材建设', 8.00, '课程资源丰富，得8分；一般得5分；较少得2分', '查看课程清单、教材目录', 4),
('三、师资队伍', '3.1 双师型教师比例', 10.00, '双师比例≥50%得10分；30%-50%得7分；<30%得4分', '查看教师资格证书、企业实践证明', 5),
('四、产教融合', '4.1 校企合作深度', 8.00, '深度合作企业≥5家得8分；3-4家得5分；<3家得2分', '查看合作协议', 6),
('五、经费投入', '5.1 年度经费投入', 12.00, '年度总投入≥500万得12分；300-500万得8分；<300万得4分', '查看财务凭证', 7),
('六、社会服务', '6.1 培训与技术服务的', 7.00, '年度培训人次≥1000得7分；500-1000得5分；<500得2分', '查看培训记录', 8);
