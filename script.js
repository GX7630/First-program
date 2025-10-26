// 数据管理函数
function saveData() {
    localStorage.setItem('announcements', JSON.stringify(announcements));
    localStorage.setItem('changelog', JSON.stringify(changelog));
    localStorage.setItem('softwareInfo', JSON.stringify(softwareInfo));
}

function loadData() {
    const savedAnnouncements = localStorage.getItem('announcements');
    const savedChangelog = localStorage.getItem('changelog');
    const savedSoftwareInfo = localStorage.getItem('softwareInfo');
    
    if (savedAnnouncements) announcements = JSON.parse(savedAnnouncements);
    if (savedChangelog) changelog = JSON.parse(savedChangelog);
    if (savedSoftwareInfo) softwareInfo = JSON.parse(savedSoftwareInfo);
}

// 模拟数据
let announcements = [
    { 
        id: 1,
        title: "系统维护通知", 
        content: "系统将于本周六凌晨2点至4点进行例行维护，届时将无法访问，请提前安排好工作。", 
        date: "2023-10-10" 
    },
    { 
        id: 2,
        title: "新版本发布", 
        content: "档案查询系统 V2.1.0 已发布，新增多项功能并优化了查询性能，请及时更新。", 
        date: "2023-10-05" 
    },
    { 
        id: 3,
        title: "使用指南更新", 
        content: "我们更新了系统使用指南，新增了高级查询功能的使用说明，请前往帮助中心查看。", 
        date: "2023-09-28" 
    }
];

let changelog = [
    { 
        id: 1,
        version: "V2.1.0", 
        date: "2023-10-15", 
        content: "新增批量导出功能，优化查询算法，修复已知问题，提升系统稳定性。" 
    },
    { 
        id: 2,
        version: "V2.0.5", 
        date: "2023-09-20", 
        content: "修复权限管理漏洞，优化界面响应速度，改进数据导入流程。" 
    },
    { 
        id: 3,
        version: "V2.0.0", 
        date: "2023-08-10", 
        content: "全新界面设计，增加高级搜索功能，改进数据安全性，优化用户体验。" 
    }
];

// 软件信息
let softwareInfo = {
    fileSize: "45.2 MB",
    updateDate: "2023-10-15",
    downloadUrl: "https://example.com/ArchiveQuerySystem.exe"
};

// 页面切换功能
document.getElementById('admin-login-link').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-modal').classList.add('active');
});

document.getElementById('back-to-main').addEventListener('click', function() {
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('admin-page').classList.add('hidden');
});

document.getElementById('logout-btn').addEventListener('click', function() {
    document.getElementById('main-page').classList.remove('hidden');
    document.getElementById('admin-page').classList.add('hidden');
});

// 登录功能
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    // 密码验证 - 使用新密码 "Rayix5201314"
    if (password === 'Rayix5201314') {
        // 登录成功
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('main-page').classList.add('hidden');
        document.getElementById('admin-page').classList.remove('hidden');
        errorElement.textContent = '';
        document.getElementById('password').value = '';
        
        // 加载管理数据
        renderAdminAnnouncements();
        renderAdminChangelog();
        loadSoftwareInfo();
    } else {
        // 登录失败
        errorElement.textContent = '密码错误，请重试';
    }
});

// 关闭模态框
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('login-modal').classList.remove('active');
    document.getElementById('password').value = '';
    document.getElementById('login-error').textContent = '';
});

// 点击模态框外部关闭
document.getElementById('login-modal').addEventListener('click', function(e) {
    if (e.target === this) {
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('password').value = '';
        document.getElementById('login-error').textContent = '';
    }
});

// 切换密码可见性
document.querySelector('.password-toggle').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// 渲染公告
function renderAnnouncements() {
    const container = document.getElementById('announcements-list');
    container.innerHTML = '';
    
    announcements.forEach(announcement => {
        const item = document.createElement('div');
        item.className = 'announcement-item liquid-glass';
        item.innerHTML = `
            <div class="announcement-header">
                <div class="announcement-title">${announcement.title}</div>
                <div class="announcement-date">${announcement.date}</div>
            </div>
            <div class="announcement-content">${announcement.content}</div>
        `;
        container.appendChild(item);
    });
}

// 渲染更新日志
function renderChangelog() {
    const container = document.getElementById('changelog-list');
    container.innerHTML = '';
    
    changelog.forEach(log => {
        const item = document.createElement('div');
        item.className = 'changelog-item liquid-glass';
        item.innerHTML = `
            <div class="changelog-header">
                <div class="changelog-version">${log.version}</div>
                <div class="changelog-date">${log.date}</div>
            </div>
            <div class="changelog-content">${log.content}</div>
        `;
        container.appendChild(item);
    });
}

// 渲染管理公告
function renderAdminAnnouncements() {
    const container = document.getElementById('admin-announcements-list');
    container.innerHTML = '';
    
    if (announcements.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">暂无公告</p >';
        return;
    }
    
    announcements.forEach(announcement => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div class="admin-item-content">
                <div class="admin-item-title">${announcement.title}</div>
                <div class="admin-item-meta">${announcement.date}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-glass btn-glass-danger delete-announcement" data-id="${announcement.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
    
    // 添加删除事件
    document.querySelectorAll('.delete-announcement').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteAnnouncement(id);
        });
    });
}

// 渲染管理更新日志
function renderAdminChangelog() {
    const container = document.getElementById('admin-changelog-list');
    container.innerHTML = '';
    
    if (changelog.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">暂无更新日志</p >';
        return;
    }
    
    changelog.forEach(log => {
        const item = document.createElement('div');
        item.className = 'admin-item';
        item.innerHTML = `
            <div class="admin-item-content">
                <div class="admin-item-title">${log.version}</div>
                <div class="admin-item-meta">${log.date}</div>
            </div>
            <div class="admin-item-actions">
                <button class="btn btn-glass btn-glass-danger delete-changelog" data-id="${log.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(item);
    });
    
    // 添加删除事件
    document.querySelectorAll('.delete-changelog').forEach(button => {
        button.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteChangelog(id);
        });
    });
}

// 删除公告
function deleteAnnouncement(id) {
    if (confirm('确定要删除这条公告吗？')) {
        announcements = announcements.filter(item => item.id !== id);
        renderAnnouncements();
        renderAdminAnnouncements();
        saveData(); // 保存到本地存储
    }
}

// 删除更新日志
function deleteChangelog(id) {
    if (confirm('确定要删除这条更新日志吗？')) {
        changelog = changelog.filter(item => item.id !== id);
        renderChangelog();
        renderAdminChangelog();
        saveData(); // 保存到本地存储
    }
}

// 加载软件信息
function loadSoftwareInfo() {
    document.getElementById('file-size-input').value = softwareInfo.fileSize;
    document.getElementById('update-date-input').value = softwareInfo.updateDate;
    document.getElementById('download-url-input').value = softwareInfo.downloadUrl;
}

// 更新软件信息
document.getElementById('update-software-info').addEventListener('click', function() {
    const fileSize = document.getElementById('file-size-input').value;
    const updateDate = document.getElementById('update-date-input').value;
    const downloadUrl = document.getElementById('download-url-input').value;
    
    if (fileSize && updateDate && downloadUrl) {
        softwareInfo.fileSize = fileSize;
        softwareInfo.updateDate = updateDate;
        softwareInfo.downloadUrl = downloadUrl;
        
        // 更新前端显示
        document.getElementById('file-size').textContent = fileSize;
        document.getElementById('update-date').textContent = updateDate;
        
        saveData(); // 保存到本地存储
        alert('软件信息更新成功！');
    } else {
        alert('请填写完整的软件信息！');
    }
});

// 添加公告
document.getElementById('add-announcement-btn').addEventListener('click', function() {
    const title = document.getElementById('announcement-title').value;
    const content = document.getElementById('announcement-content').value;
    
    if (title && content) {
        const today = new Date().toISOString().split('T')[0];
        const newId = announcements.length > 0 ? Math.max(...announcements.map(a => a.id)) + 1 : 1;
        
        announcements.unshift({
            id: newId,
            title: title,
            content: content,
            date: today
        });
        
        renderAnnouncements();
        renderAdminAnnouncements();
        
        // 清空表单
        document.getElementById('announcement-title').value = '';
        document.getElementById('announcement-content').value = '';
        
        saveData(); // 保存到本地存储
        alert('公告发布成功！');
    } else {
        alert('请填写完整的公告信息！');
    }
});

// 添加更新日志
document.getElementById('add-changelog-btn').addEventListener('click', function() {
    const version = document.getElementById('changelog-version').value;
    const date = document.getElementById('changelog-date').value;
    const content = document.getElementById('changelog-content').value;
    
    if (version && date && content) {
        const newId = changelog.length > 0 ? Math.max(...changelog.map(c => c.id)) + 1 : 1;
        
        changelog.unshift({
            id: newId,
            version: version,
            date: date,
            content: content
        });
        
        renderChangelog();
        renderAdminChangelog();
        
        // 清空表单
        document.getElementById('changelog-version').value = '';
        document.getElementById('changelog-date').value = '';
        document.getElementById('changelog-content').value = '';
        
        saveData(); // 保存到本地存储
        alert('更新日志添加成功！');
    } else {
        alert('请填写完整的更新日志信息！');
    }
});

// 下载文件功能
document.getElementById('download-btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    // 获取下载链接
    const downloadUrl = softwareInfo.downloadUrl;
    
    if (!downloadUrl || downloadUrl === 'https://example.com/ArchiveQuerySystem.exe') {
        alert('请先在后台管理设置中配置有效的下载链接！');
        return;
    }
    
    const progressBar = document.getElementById('download-progress-bar');
    const progressContainer = document.getElementById('download-progress');
    
    // 显示进度条
    progressContainer.style.display = 'block';
    progressBar.style.width = '0%';
    
    // 模拟下载进度
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            
            // 创建隐藏的下载链接并触发点击
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = 'ArchiveQuerySystem.exe';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
                alert('下载完成！文件已开始下载。');
            }, 500);
        } else {
            width += Math.random() * 10;
            progressBar.style.width = Math.min(width, 100) + '%';
        }
    }, 100);
});

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 从本地存储加载数据
    loadData();
    
    // 更新前端显示
    document.getElementById('file-size').textContent = softwareInfo.fileSize;
    document.getElementById('update-date').textContent = softwareInfo.updateDate;
    
    renderAnnouncements();
    renderChangelog();
    
    // 设置默认日期为今天
    document.getElementById('changelog-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('update-date-input').value = new Date().toISOString().split('T')[0];
    
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 移动端菜单切换
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            const navLinks = document.querySelector('.nav-links');
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
});
