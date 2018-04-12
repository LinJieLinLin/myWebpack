/**
 * constants 常量定义
 * Created by ph2 on 2016/8/30.
 */
(function(global) {
    if (!global.DYCONFIG) {
        console.error('DYCONFIG not found');
        return;
    }
    var constants = global.DYCONFIG.constants;
    if (!constants) {
        constants = global.DYCONFIG.constants = {};
    }
    if (constants._init_) {
        return;
    }

    // 用户角色类型
    var userRole = {
        // 普通
        'GENERAL': 'general',
        // 平台管理员
        'ADMIN_RCP': 'admin_rcp',
        // 机构账号 机构创始人
        'ORG_CREATOR': 'org_creator',
        // 机构管理员
        'ADMIN_ORG': 'admin_org',
        // 普通管理员
        'ADMIN_GENERAL': 'admin_general',
    };

    // 权限类型
    var permissions = {
        // ------------ 平台
        // 平台实名认证
        'MEMBER_APPROVAL': 'member_approval',
        // 平台课程审核
        'COURSE_APPROVAL': 'course_approval',
        // 平台职位审核
        'POSITION_APPROVAL': 'position_approval',
        // 平台用户管理
        'MANAGE_USER': 'manage_user',
        // 平台机构管理
        'MANAGE_ORGANIZATION': 'manage_organization',
        // 平台举报管理
        'MANAGE_REPORT': 'manage_report',
        // 高校概况
        'COLLEGE_ANALYZE': 'college_analyze',
        // 课程统计
        'COURSE_ANALYZE': 'course_analyze',
        // 教师统计
        'TEACHER_ANALYZE': 'teacher_analyze',
        // 教师导入学生到课程
        'COURSE_MANAGER': 'course_manager',

        // 运行分析 - 运行概况
        'OPERATIONS_OPERATION_SUMMARY': 'operations_operation_summary',
        // 运行分析 - 课程统计
        'OPERATIONS_COURSE_STATISTICS': 'operations_course_statistics',
        // 运行分析 - 老师统计
        'OPERATIONS_TEACHER_STATISTICS': 'operations_teacher_statistics',
        // 运行分析 - 企业分析
        'OPERATIONS_COMPANY_ANALYZE': 'operations_company_analyze',

        // 平台首页管理
        'MANAGE_HOMEPAGE': 'manage_homepage',
        // 分类管理
        'MANAGE_CLASSIFICATION': 'manage_classification',

        // 平台运营管理 - 招聘套餐
        'OPERATIONS_RECRUIT_PACKAGE': 'operations_recruit_package',

        // ------------ 机构
        // 机构: 运行分析 - 课程统计
        'ORG_OPERATIONS_COURSE_STATISTICS': 'org_operations_course_statistics',
        // 机构: 运行分析 - 老师统计
        'ORG_OPERATIONS_TEACHER_STATISTICS': 'org_operations_teacher_statistics',

        // 机构课程认证
        'ORG_COURSE_IDENTIFY': 'org_course_identify',
        // 机构身份认证
        'ORG_CARD_IDENTIFY': 'org_card_identify',
        // 机构用户管理
        'ORG_MANAGE_USER': 'org_manage_user',
        // 机构 资讯管理
        'ORG_MANAGE_NEWS': 'org_manage_news',

        // 机构 招聘
        'ORG_RECRUIT': 'org_recruit',

        // ------------ 爱科学
        // 爱科学教师角色
        'AIKEXUE_TEACHER': 'aikexue_teacher',
    };

    // 权限类型聚合
    var _PMSS = {
        // 平台账号管理
        'MANAGE_ACCOUNT': [permissions.MANAGE_USER, permissions.MANAGE_ORGANIZATION],
        // 平台学情分析
        'LEARNING_SITUATION': [permissions.COLLEGE_ANALYZE, permissions.COURSE_ANALYZE, permissions.TEACHER_ANALYZE],
        // 平台内容管理
        'MANAGE_CONTENT': [permissions.MANAGE_HOMEPAGE, permissions.MANAGE_CLASSIFICATION],
        // 平台运行分析
        'OPERATIONS_ANALYSIS': [permissions.OPERATIONS_OPERATION_SUMMARY, permissions.OPERATIONS_COURSE_STATISTICS, permissions.OPERATIONS_TEACHER_STATISTICS, permissions.OPERATIONS_COMPANY_ANALYZE],

        // 机构认证管理
        'ORG_MANAGE_AUTH': [permissions.ORG_COURSE_IDENTIFY, permissions.ORG_CARD_IDENTIFY],
        // 机构运行分析
        'ORG_OPERATIONS_ANALYSIS': [permissions.ORG_OPERATIONS_COURSE_STATISTICS, permissions.ORG_OPERATIONS_TEACHER_STATISTICS],

    };

    // 角色权限配置 (后端的角色类型对应拥有的权限)
    // 同一角色类型在不同适场景的对应权限:
    //      所有() permissions;  平台(rcp) rcpPermissions; 机构(org) orgPermissions; 爱科学(akx) akxPermissions; 招聘机构(orgRecruit) orgRecruitPermissions
    var rolePermissionsConf = {
        'RCP_ADMIN': {
            desc: '平台管理员',
            exclusive: true,
            rcpPermissions: [].concat(permissions.MEMBER_APPROVAL, permissions.COURSE_APPROVAL, permissions.POSITION_APPROVAL, _PMSS.MANAGE_ACCOUNT, permissions.MANAGE_REPORT, _PMSS.LEARNING_SITUATION, _PMSS.MANAGE_CONTENT, _PMSS.OPERATIONS_ANALYSIS, permissions.OPERATIONS_RECRUIT_PACKAGE)
        },
        'ORG_ADMIN': {
            desc: '机构创始人',
            exclusive: true,
            orgPermissions: [].concat(_PMSS.ORG_MANAGE_AUTH, permissions.ORG_MANAGE_USER, permissions.ORG_MANAGE_NEWS, _PMSS.ORG_OPERATIONS_ANALYSIS),
            orgRecruitPermissions: [permissions.ORG_RECRUIT],
        },
        'USR_ADMIN': {
            desc: '用户管理员',
            rcpPermissions: [permissions.MANAGE_USER],
            orgPermissions: [permissions.ORG_MANAGE_USER]
        },
        'COURSE_VERIFY_ADMIN': {
            desc: '课程审核管理员',
            rcpPermissions: [permissions.COURSE_APPROVAL],
            orgPermissions: [permissions.ORG_COURSE_IDENTIFY]
        },
        'CERT_VERIFY_ADMIN': {
            desc: '认证管理员',
            rcpPermissions: [permissions.MEMBER_APPROVAL],
            orgPermissions: [].concat(_PMSS.ORG_MANAGE_AUTH)
        },
        'PAGE_ADMIN': {
            desc: '首页管理员',
            rcpPermissions: _PMSS.MANAGE_CONTENT
        },
        'CUSTOM_SERVICE': {
            desc: '客服'
        },
        'SYS_NOTIFICATION': {
            desc: '系统通知'
        },
        'COURSE_EDITOR': {
            desc: '课程编辑权限',
            orgPermissions: [permissions.COURSE_MANAGER]
        },
        'REPORT_ADMIN': {
            desc: '举报管理',
            rcpPermissions: [permissions.MANAGE_REPORT]
        },
        'AKX_TEACHER': {
            desc: '爱科学教师角色',
            akxPermissions: [permissions.AIKEXUE_TEACHER]
        },
        'OPERATIONS_OPERATION_ADMIN': {
            desc: '运行分析管理员',
            rcpPermissions: [].concat(_PMSS.OPERATIONS_ANALYSIS),
            orgPermissions: [].concat(_PMSS.ORG_OPERATIONS_ANALYSIS),
        },
        // 'OPERATIONS_OPERATION_SUMMARY': {
        //   desc: '运行分析 - 运行概况',
        //   rcpPermissions: [permissions.OPERATIONS_OPERATION_SUMMARY],
        // },
        // 'OPERATIONS_COURSE_STATISTICS': {
        //   desc: '运行分析 - 课程统计',
        //   rcpPermissions: [permissions.OPERATIONS_COURSE_STATISTICS],
        //   orgPermissions: [permissions.ORG_OPERATIONS_COURSE_STATISTICS],
        // },
        // 'OPERATIONS_TEACHER_STATISTICS': {
        //   desc: '运行分析 - 老师统计',
        //   rcpPermissions: [permissions.OPERATIONS_TEACHER_STATISTICS],
        //   orgPermissions: [permissions.ORG_OPERATIONS_TEACHER_STATISTICS],
        // },
    };

    // 挂到 constants 下

    constants.permissions = permissions;
    constants.userRole = userRole;
    constants.rolePermissionsConf = rolePermissionsConf;
    constants._init_ = true;
})(window);