// 主功能文件 - 从data.js读取数据并实现所有功能

// 直接明文密码验证
const ADMIN_PASSWORD = 'Rayix5201314';

// 全局变量
let announcementsVirtualScroll;
let changelogVirtualScroll;
let livePreview;

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

// 登录功能 - 直接明文比较
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
   
    // 直接密码验证
    if (password === ADMIN_PASSWORD) {
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
        loadSystemConfig();
       
        // 初始化实时预览
        if (!livePreview) {
            livePreview = new LivePreview();
        }
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

// 虚拟滚动系统
class VirtualScroll {
    constructor(container, items, itemHeight, renderItem) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.renderItem = renderItem;
        this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
        this.startIndex = 0;
       
        this.init();
    }
   
    init() {
        // 设置容器高度
        this.container.style.height = `${this.items.length * this.itemHeight}px`;
       
        // 创建内容容器
        this.content = this.container.querySelector('.virtual-scroll-content') ||
                      document.createElement('div');
        this.content.className = 'virtual-scroll-content';
        this.content.style.position = 'relative';
        this.content.style.height = `${this.items.length * this.itemHeight}px`;
       
        if (!this.container.contains(this.content)) {
            this.container.appendChild(this.content);
        }
       
        // 绑定滚动事件
        this.container.addEventListener('scroll', this.handleScroll.bind(this));
       
        // 初始渲染
        this.renderVisibleItems();
    }
   
    handleScroll() {
        const scrollTop = this.container.scrollTop;
        const newStartIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - 1);
       
        if (newStartIndex !== this.startIndex) {
            this.startIndex = newStartIndex;
            this.renderVisibleItems();
        }
    }
   
    renderVisibleItems() {
        const endIndex = Math.min(this.startIndex + this.visibleCount, this.items.length);
       
        // 清除现有内容
        this.content.innerHTML = '';
       
        // 渲染可见项
        for (let i = this.startIndex; i < endIndex; i++) {
            const item = this.items[i];
            const itemElement = this.renderItem(item);
            itemElement.style.position = 'absolute';
            itemElement.style.top = `${i * this.itemHeight}px`;
            itemElement.style.width = '100%';
            this.content.appendChild(itemElement);
        }
    }
   
    updateItems(newItems) {
        this.items = newItems;
        this.content.style.height = `${this.items.length * this.itemHeight}px`;
        this.renderVisibleItems();
    }
}

// 触摸手势支持
class TouchGesture {
    constructor(element, options = {}) {
        this.element = element;
        this.threshold = options.threshold || 50;
        this.onSwipeLeft = options.onSwipeLeft;
        this.onSwipeRight = options.onSwipeRight;
       
        this.startX = 0;
        this.currentX = 0;
        this.isSwiping = false;
       
        this.init();
    }
   
    init() {
        this.element.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.element.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.element.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
   
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.isSwiping = true;
        this.element.style.transition = 'none';
    }
   
    handleTouchMove(e) {
        if (!this.isSwiping) return;
       
        this.currentX = e.touches[0].clientX;
        const diff = this.currentX - this.startX;
       
        // 限制最大滑动距离
        if (Math.abs(diff) > this.threshold * 2) return;
       
        this.element.style.transform = `translateX(${diff}px)`;
    }
   
    handleTouchEnd() {
        if (!this.isSwiping) return;
       
        this.isSwiping = false;
        this.element.style.transition = 'transform 0.3s ease';
       
        const diff = this.currentX - this.startX;
       
        if (Math.abs(diff) > this.threshold) {
            if (diff < 0 && this.onSwipeLeft) {
                this.onSwipeLeft();
                this.element.classList.add('swiped');
            } else if (diff > 0 && this.onSwipeRight) {
                this.onSwipeRight();
                this.element.classList.remove('swiped');
            } else {
                this.element.style.transform = '';
            }
        } else {
            this.element.style.transform = '';
        }
    }
}

// 实时预览系统
class LivePreview {
    constructor() {
        this.init();
    }
   
    init() {
        // 绑定公告预览
        const announcementTitle = document.getElementById('announcement-title');
        const announcementContent = document.getElementById('announcement-content');
       
        if (announcementTitle && announcementContent) {
            announcementTitle.addEventListener('input', this.updateAnnouncementPreview.bind(this));
            announcementContent.addEventListener('input', this.updateAnnouncementPreview.bind(this));
        }
       
        // 绑定更新日志预览
        const changelogVersion = document.getElementById('changelog-version');
        const changelogContent = document.getElementById('changelog-content');
        const changelogDate = document.getElementById('changelog-date');
       
        if (changelogVersion && changelogContent && changelogDate) {
            changelogVersion.addEventListener('input', this.updateChangelogPreview.bind(this));
            changelogContent.addEventListener('input', this.updateChangelogPreview.bind(this));
            changelogDate.addEventListener('input', this.updateChangelogPreview.bind(this));
        }
       
        // 绑定预览标签切换
        this.initPreviewTabs();
       
        // 初始更新预览
        this.updateAnnouncementPreview();
        this.updateChangelogPreview();
    }
   
    initPreviewTabs() {
        const tabs = document.querySelectorAll('.preview-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // 移除所有active类
                tabs.forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.preview-tab-content').forEach(c => c.classList.remove('active'));
               
                // 添加active类
                tab.classList.add('active');
                const tabName = tab.dataset.tab;
                document.getElementById(`${tabName}-preview`).classList.add('active');
            });
        });
    }
   
    updateAnnouncementPreview() {
        const title = document.getElementById('announcement-title').value || '公告标题';
        const content = document.getElementById('announcement-content').value || '公告内容将在这里实时预览...';
        const date = new Date().toISOString().split('T')[0];
       
        document.getElementById('preview-announcement-title').textContent = title;
        document.getElementById('preview-announcement-content').textContent = content;
        document.getElementById('preview-announcement-date').textContent = date;
    }
   
    updateChangelogPreview() {
        const version = document.getElementById('changelog-version').value || 'V2.1.0';
        const content = document.getElementById('changelog-content').value || '更新日志内容将在这里实时预览...';
        const date = document.getElementById('changelog-date').value || new Date().toISOString().split('T')[0];
       
        document.getElementById('preview-changelog-version').textContent = version;
        document.getElementById('preview-changelog-content').textContent = content;
        document.getElementById('preview-changelog-date').textContent = date;
    }
}

// 智能缓存系统
const cache = {
    set: (key, data, ttl = 300000) => {
        const item = {
            data,
            expiry: Date.now() + ttl,
            version: '1.0'
        };
        try {
            localStorage.setItem(`cache_${key}`, JSON.stringify(item));
            return true;
        } catch (e) {
            console.warn('缓存存储失败:', e);
            return false;
        }
    },
   
    get: (key) => {
        try {
            const itemStr = localStorage.getItem(`cache_${key}`);
            if (!itemStr) return null;
           
            const item = JSON.parse(itemStr);
            if (Date.now() > item.expiry) {
                localStorage.removeItem(`cache_${key}`);
                return null;
            }
           
            return item.data;
        } catch (e) {
            console.warn('缓存读取失败:', e);
            return null;
        }
    },
   
    clear: (pattern = '') => {
        Object.keys(localStorage)
            .filter(key => key.startsWith(`cache_${pattern}`))
            .forEach(key => localStorage.removeItem(key));
    }
};

// 性能优化 - 防抖函数
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// 渲染公告（虚拟滚动版本）
function renderAnnouncements() {
    const container = document.getElementById('announcements-virtual-content');
    if (!container) return;
   
    // 尝试从缓存获取
    const cachedData = cache.get('announcements');
    const dataToRender = cachedData || announcements;
   
    if (!announcementsVirtualScroll) {
        announcementsVirtualScroll = new VirtualScroll(
            container.parentElement,
            dataToRender,
            120, // 项目高度
            (announcement) => {
                const item = document.createElement('div');
                item.className = 'announcement-item liquid-glass';
                item.innerHTML = `
                    <div class="announcement-header">
                        <div class="announcement-title">${announcement.title}</div>
                        <div class="announcement-date">${announcement.date}</div>
                    </div>
                    <div class="announcement-content">${announcement.content}</div>
                `;
               
                // 添加触摸手势支持
                new TouchGesture(item, {
                    threshold: 50,
                    onSwipeLeft: () => {
                        console.log('左滑公告:', announcement.title);
                    },
                    onSwipeRight: () => {
                        console.log('右滑公告:', announcement.title);
                    }
                });
               
                return item;
            }
        );
    } else {
        announcementsVirtualScroll.updateItems(dataToRender);
    }
   
    // 缓存数据
    if (!cachedData) {
        cache.set('announcements', announcements);
    }
}

// 渲染更新日志（虚拟滚动版本）
function renderChangelog() {
    const container = document.getElementById('changelog-virtual-content');
    if (!container) return;
   
    // 尝试从缓存获取
    const cachedData = cache.get('changelog');
    const dataToRender = cachedData || changelog;
   
    if (!changelogVirtualScroll) {
        changelogVirtualScroll = new VirtualScroll(
            container.parentElement,
            dataToRender,
            120, // 项目高度
            (log) => {
                const item = document.createElement('div');
                item.className = 'changelog-item liquid-glass';
                item.innerHTML = `
                    <div class="changelog-header">
                        <div class="changelog-version">${log.version}</div>
                        <div class="changelog-date">${log.date}</div>
                    </div>
                    <div class="changelog-content">${log.content}</div>
                `;
               
                // 添加触摸手势支持
                new TouchGesture(item, {
                    threshold: 50,
                    onSwipeLeft: () => {
                        console.log('左滑更新日志:', log.version);
                    },
                    onSwipeRight: () => {
                        console.log('右滑更新日志:', log.version);
                    }
                });
               
                return item;
            }
        );
    } else {
        changelogVirtualScroll.updateItems(dataToRender);
    }
   
    // 缓存数据
    if (!cachedData) {
        cache.set('changelog', changelog);
    }
}

// 搜索功能
function initSearch() {
    const announcementSearch = document.getElementById('announcement-search');
    const changelogSearch = document.getElementById('changelog-search');
   
    if (announcementSearch) {
        announcementSearch.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = announcements.filter(item =>
                item.title.toLowerCase().includes(searchTerm) ||
                item.content.toLowerCase().includes(searchTerm)
            );
           
            if (announcementsVirtualScroll) {
                announcementsVirtualScroll.updateItems(filtered);
            }
        }, 300));
    }
   
    if (changelogSearch) {
        changelogSearch.addEventListener('input', debounce((e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filtered = changelog.filter(item =>
                item.version.toLowerCase().includes(searchTerm) ||
                item.content.toLowerCase().includes(searchTerm)
            );
           
            if (changelogVirtualScroll) {
                changelogVirtualScroll.updateItems(filtered);
            }
        }, 300));
    }
}

// 渲染管理公告
function renderAdminAnnouncements() {
    const container = document.getElementById('admin-announcements-list');
    container.innerHTML = '';
   
    if (announcements.length === 0) {
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">暂无公告</p>';
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
       
        // 添加触摸手势支持
        new TouchGesture(item, {
            threshold: 50,
            onSwipeLeft: () => {
                item.classList.add('swiped');
            },
            onSwipeRight: () => {
                item.classList.remove('swiped');
            }
        });
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
        container.innerHTML = '<p style="color: var(--text-secondary); text-align: center;">暂无更新日志</p>';
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
       
        // 添加触摸手势支持
        new TouchGesture(item, {
            threshold: 50,
            onSwipeLeft: () => {
                item.classList.add('swiped');
            },
            onSwipeRight: () => {
                item.classList.remove('swiped');
            }
        });
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
        cache.clear('announcements'); // 清除缓存
    }
}

// 删除更新日志
function deleteChangelog(id) {
    if (confirm('确定要删除这条更新日志吗？')) {
        changelog = changelog.filter(item => item.id !== id);
        renderChangelog();
        renderAdminChangelog();
        cache.clear('changelog'); // 清除缓存
    }
}

// 加载软件信息
function loadSoftwareInfo() {
    document.getElementById('software-version-input').value = softwareInfo.version;
    document.getElementById('file-size-input').value = softwareInfo.fileSize;
    document.getElementById('update-date-input').value = softwareInfo.updateDate;
    document.getElementById('download-url-input').value = softwareInfo.downloadUrl;
    document.getElementById('download-filename-input').value = systemConfig.downloadFilename;
    document.getElementById('software-description-input').value = softwareInfo.description;
}

// 加载系统配置
function loadSystemConfig() {
    document.getElementById('page-title-input').value = systemConfig.pageTitle;
    document.getElementById('nav-title-input').value = systemConfig.navTitle;
    document.getElementById('hero-title-input').value = systemConfig.heroTitle;
    document.getElementById('hero-subtitle-input').value = systemConfig.heroSubtitle;
    document.getElementById('footer-text-input').value = systemConfig.footerText;
}

// 更新系统配置
document.getElementById('update-system-config').addEventListener('click', function() {
    const pageTitle = document.getElementById('page-title-input').value;
    const navTitle = document.getElementById('nav-title-input').value;
    const heroTitle = document.getElementById('hero-title-input').value;
    const heroSubtitle = document.getElementById('hero-subtitle-input').value;
    const footerText = document.getElementById('footer-text-input').value;
   
    if (pageTitle && navTitle && heroTitle && heroSubtitle && footerText) {
        systemConfig.pageTitle = pageTitle;
        systemConfig.navTitle = navTitle;
        systemConfig.heroTitle = heroTitle;
        systemConfig.heroSubtitle = heroSubtitle;
        systemConfig.footerText = footerText;
       
        // 更新前端显示
        updateSystemDisplay();
       
        alert('系统配置更新成功！');
    } else {
        alert('请填写完整的系统配置信息！');
    }
});

// 更新系统显示
function updateSystemDisplay() {
    document.getElementById('page-title').textContent = systemConfig.pageTitle;
    document.getElementById('nav-title').textContent = systemConfig.navTitle;
    document.getElementById('admin-nav-title').textContent = systemConfig.navTitle + ' - 管理后台';
    document.getElementById('hero-title').textContent = systemConfig.heroTitle;
    document.getElementById('hero-subtitle').textContent = systemConfig.heroSubtitle;
    document.getElementById('footer-text').textContent = systemConfig.footerText;
}

// 更新软件信息
document.getElementById('update-software-info').addEventListener('click', function() {
    const version = document.getElementById('software-version-input').value;
    const fileSize = document.getElementById('file-size-input').value;
    const updateDate = document.getElementById('update-date-input').value;
    const downloadUrl = document.getElementById('download-url-input').value;
    const downloadFilename = document.getElementById('download-filename-input').value;
    const description = document.getElementById('software-description-input').value;
   
    if (version && fileSize && updateDate && downloadUrl && downloadFilename && description) {
        softwareInfo.version = version;
        softwareInfo.fileSize = fileSize;
        softwareInfo.updateDate = updateDate;
        softwareInfo.downloadUrl = downloadUrl;
        softwareInfo.description = description;
        systemConfig.downloadFilename = downloadFilename;
       
        // 更新前端显示
        document.getElementById('software-version').textContent = `${systemConfig.navTitle} ${version}`;
        document.getElementById('file-size').textContent = fileSize;
        document.getElementById('update-date').textContent = updateDate;
        document.getElementById('software-description').textContent = description;
       
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
       
        // 清除缓存
        cache.clear('announcements');
       
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
       
        // 清除缓存
        cache.clear('changelog');
       
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
   
    // 创建隐藏的下载链接并触发点击
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = systemConfig.downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
   
    alert('下载开始！文件将保存到您的下载文件夹。');
});

// 导出数据文件功能
document.getElementById('export-data-btn').addEventListener('click', function() {
    // 创建数据对象
    const dataToSave = {
        systemConfig: systemConfig,
        announcements: announcements,
        changelog: changelog,
        softwareInfo: softwareInfo
    };
   
    // 创建数据文件内容
    const fileContent = `// 数据文件 - 所有数据存储在这里
// 其他文件从该文件读取数据

// 系统配置数据
let systemConfig = ${JSON.stringify(dataToSave.systemConfig, null, 4)};

// 公告数据
let announcements = ${JSON.stringify(dataToSave.announcements, null, 4)};

// 更新日志数据
let changelog = ${JSON.stringify(dataToSave.changelog, null, 4)};

// 软件信息数据
let softwareInfo = ${JSON.stringify(dataToSave.softwareInfo, null, 4)};
`;
   
    // 创建下载链接
    const blob = new Blob([fileContent], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
   
    alert('数据已成功导出到 data.js 文件中！');
});

// 数据导入功能
document.getElementById('import-data-btn').addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.js,.txt';
    fileInput.style.display = 'none';
   
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
       
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const fileContent = e.target.result;
                importDataFromFile(fileContent);
            } catch (error) {
                alert('文件导入失败：' + error.message);
            }
        };
        reader.readAsText(file);
    });
   
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
});

// 解析导入的数据文件
function importDataFromFile(fileContent) {
    // 临时执行环境来解析数据
    const tempEnv = {
        systemConfig: {},
        announcements: [],
        changelog: [],
        softwareInfo: {}
    };
   
    try {
        // 使用 Function 构造函数安全地执行代码
        const dataExtractor = new Function('systemConfig', 'announcements', 'changelog', 'softwareInfo', `
            ${fileContent}
            return { systemConfig, announcements, changelog, softwareInfo };
        `);
       
        const importedData = dataExtractor({}, [], [], {});
       
        // 验证数据结构
        if (typeof importedData.systemConfig !== 'object' ||
            !Array.isArray(importedData.announcements) ||
            !Array.isArray(importedData.changelog) ||
            typeof importedData.softwareInfo !== 'object') {
            throw new Error('数据格式不正确');
        }
       
        // 更新数据
        Object.assign(systemConfig, importedData.systemConfig);
        announcements.length = 0;
        announcements.push(...importedData.announcements);
        changelog.length = 0;
        changelog.push(...importedData.changelog);
        Object.assign(softwareInfo, importedData.softwareInfo);
       
        // 重新渲染所有内容
        updateSystemDisplay();
        renderAnnouncements();
        renderChangelog();
        renderAdminAnnouncements();
        renderAdminChangelog();
       
        // 更新前端显示
        document.getElementById('software-version').textContent = `${systemConfig.navTitle} ${softwareInfo.version}`;
        document.getElementById('file-size').textContent = softwareInfo.fileSize;
        document.getElementById('update-date').textContent = softwareInfo.updateDate;
        document.getElementById('software-description').textContent = softwareInfo.description;
       
        // 清除缓存
        cache.clear();
       
        alert('数据导入成功！');
    } catch (error) {
        throw new Error('无法解析数据文件：' + error.message);
    }
}

// 主题切换功能
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
   
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
   
    // 创建主题切换按钮
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle liquid-glass';
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    document.body.appendChild(themeToggle);
   
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
       
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
       
        // 更新图标
        const icon = this.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    });
   
    // 初始图标设置
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const icon = themeToggle.querySelector('i');
    icon.className = currentTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// 创建粒子背景
function createParticles() {
    const container = document.createElement('div');
    container.className = 'particles-container';
    document.body.appendChild(container);
   
    const particleCount = 30;
   
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
       
        // 随机属性
        const size = Math.random() * 6 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 10 + 15;
       
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
       
        // 随机颜色
        const colors = ['var(--primary-color)', 'var(--secondary-color)', 'var(--accent-color)'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = randomColor;
       
        container.appendChild(particle);
    }
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 隐藏骨架屏，显示主要内容
    setTimeout(() => {
        document.getElementById('skeleton-loader').classList.add('hidden');
        document.getElementById('main-page').classList.remove('hidden');
        document.body.classList.add('page-load-animation');
    }, 1000);
   
    // 更新系统显示
    updateSystemDisplay();
   
    // 更新前端显示
    document.getElementById('software-version').textContent = `${systemConfig.navTitle} ${softwareInfo.version}`;
    document.getElementById('file-size').textContent = softwareInfo.fileSize;
    document.getElementById('update-date').textContent = softwareInfo.updateDate;
    document.getElementById('software-description').textContent = softwareInfo.description;
   
    // 初始化虚拟滚动
    renderAnnouncements();
    renderChangelog();
   
    // 初始化搜索功能
    initSearch();
   
    // 设置默认日期为今天
    document.getElementById('changelog-date').value = new Date().toISOString().split('T')[0];
    document.getElementById('update-date-input').value = new Date().toISOString().split('T')[0];
   
    // 初始化主题
    initTheme();
   
    // 创建粒子背景
    createParticles();
   
    // 初始化实时预览
    livePreview = new LivePreview();
   
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
