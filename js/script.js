// 全局变量
let currentDownloadFile = null;

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化AOS动画库
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // 初始化GSAP ScrollTrigger
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        
        // 页面标题动画
        gsap.utils.toArray('section h1, section h2').forEach((heading, i) => {
            gsap.from(heading, {
                y: 50,
                opacity: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                }
            });
        });
    }

    // 移动端菜单切换
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('fade-in');
            }
        });
    }

    // 主题切换
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const body = document.body;
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        updateThemeIcons('dark');
    }
    
    function updateThemeIcons(theme) {
        const icons = document.querySelectorAll('#theme-toggle i, #theme-toggle-mobile i');
        icons.forEach(icon => {
            if (theme === 'dark') {
                icon.classList.remove('fa-moon-o');
                icon.classList.add('fa-sun-o');
            } else {
                icon.classList.remove('fa-sun-o');
                icon.classList.add('fa-moon-o');
            }
        });
    }
    
    function toggleTheme() {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        updateThemeIcons(isDark ? 'dark' : 'light');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // 搜索功能
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (query === '') return;
        
        // 获取所有资源卡片
        const resourceCards = document.querySelectorAll('.resource-card');
        let found = false;
        
        resourceCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = card.querySelector('p')?.textContent.toLowerCase() || '';
            
            if (title.includes(query) || description.includes(query)) {
                card.style.display = 'block';
                found = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // 显示搜索结果通知
        showNotification(found ? `找到 ${document.querySelectorAll('.resource-card[style*="display: block"]').length} 个结果` : '未找到相关资源');
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // 搜索框焦点效果
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('ring-2', 'ring-primary');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('ring-2', 'ring-primary');
        });
    }

    // 资源过滤功能
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active状态
            filterButtons.forEach(btn => {
                btn.classList.remove('active', 'bg-primary', 'text-white');
                btn.classList.add('bg-gray-200', 'hover:bg-primary', 'hover:text-white');
            });
            
            // 添加当前按钮的active状态
            this.classList.add('active', 'bg-primary', 'text-white');
            this.classList.remove('bg-gray-200', 'hover:bg-primary', 'hover:text-white');
            
            const filter = this.getAttribute('data-filter');
            const resourceCards = document.querySelectorAll('.resource-card');
            
            resourceCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // 下载功能
    const downloadButtons = document.querySelectorAll('.download-btn');
    const downloadModal = document.getElementById('download-modal');
    const closeModal = document.getElementById('close-modal');
    const cancelDownload = document.getElementById('cancel-download');
    const confirmDownload = document.getElementById('confirm-download');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    function openDownloadModal(file, size, version) {
        currentDownloadFile = file;
        modalTitle.textContent = `下载 ${file}`;
        modalContent.textContent = `你确定要下载 ${file} 吗？\n版本: ${version}\n大小: ${size}`;
        downloadModal.classList.remove('hidden');
        downloadModal.classList.add('scale-in');
    }
    
    function closeDownloadModal() {
        downloadModal.classList.add('hidden');
        downloadModal.classList.remove('scale-in');
        currentDownloadFile = null;
    }
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const file = this.getAttribute('data-file');
            const size = this.getAttribute('data-size');
            const version = this.getAttribute('data-version');
            openDownloadModal(file, size, version);
        });
    });
    
    if (closeModal) {
        closeModal.addEventListener('click', closeDownloadModal);
    }
    
    if (cancelDownload) {
        cancelDownload.addEventListener('click', closeDownloadModal);
    }
    
    if (confirmDownload) {
        confirmDownload.addEventListener('click', function() {
            // 模拟下载
            showNotification(`开始下载 ${currentDownloadFile}...`);
            
            // 模拟下载进度
            setTimeout(() => {
                showNotification(`${currentDownloadFile} 下载完成！`);
            }, 2000);
            
            closeDownloadModal();
        });
    }

    // 点击模态框外部关闭
    if (downloadModal) {
        downloadModal.addEventListener('click', function(e) {
            if (e.target === downloadModal) {
                closeDownloadModal();
            }
        });
    }

    // 通知提示功能
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notification-text');
    
    function showNotification(message, type = 'success') {
        if (!notification || !notificationText) return;
        
        notificationText.textContent = message;
        
        // 设置通知类型样式
        notification.className = 'fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg transform transition-all duration-300 z-50';
        
        if (type === 'success') {
            notification.classList.add('bg-green-500', 'text-white');
        } else if (type === 'error') {
            notification.classList.add('bg-red-500', 'text-white');
        } else if (type === 'warning') {
            notification.classList.add('bg-yellow-500', 'text-white');
        } else if (type === 'info') {
            notification.classList.add('bg-blue-500', 'text-white');
        }
        
        // 显示通知
        notification.classList.remove('translate-y-20', 'opacity-0');
        notification.classList.add('translate-y-0', 'opacity-100');
        
        // 3秒后隐藏
        setTimeout(() => {
            notification.classList.add('translate-y-20', 'opacity-0');
            notification.classList.remove('translate-y-0', 'opacity-100');
        }, 3000);
    }

    // 滚动到顶部按钮
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    
    function toggleScrollTopBtn() {
        if (!scrollTopBtn) return;
        
        if (window.scrollY > 300) {
            scrollTopBtn.classList.remove('translate-y-20', 'opacity-0');
            scrollTopBtn.classList.add('translate-y-0', 'opacity-100');
        } else {
            scrollTopBtn.classList.add('translate-y-20', 'opacity-0');
            scrollTopBtn.classList.remove('translate-y-0', 'opacity-100');
        }
    }
    
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    window.addEventListener('scroll', toggleScrollTopBtn);

    // 页面加载完成后隐藏加载动画
    const pageLoader = document.getElementById('page-loader');
    
    window.addEventListener('load', function() {
        if (pageLoader) {
            setTimeout(() => {
                pageLoader.classList.add('opacity-0');
                setTimeout(() => {
                    pageLoader.classList.add('hidden');
                }, 500);
            }, 500);
        }
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 卡片悬停效果增强
    const cards = document.querySelectorAll('.card-hover');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 按钮点击效果
    const buttons = document.querySelectorAll('button:not(.filter-btn)');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 创建涟漪效果
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('absolute', 'bg-white', 'bg-opacity-30', 'rounded-full', 'transform', 'scale-0', 'animate-ripple', 'pointer-events-none');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 添加CSS动画关键帧
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        .animate-ripple {
            animation: ripple 0.6s linear;
        }
    `;
    document.head.appendChild(style);

    // 滚动到资源分类功能
    const scrollToResourcesBtn = document.getElementById('scroll-to-resources');
    if (scrollToResourcesBtn) {
        scrollToResourcesBtn.addEventListener('click', function() {
            const resourcesSection = document.getElementById('resources');
            if (resourcesSection) {
                resourcesSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }

    // 初始化页面
    toggleScrollTopBtn();
});

// 防止右键菜单（可选）
// document.addEventListener('contextmenu', function(e) {
//     e.preventDefault();
//     return false;
// });

// 防止拖拽（可选）
// document.addEventListener('dragstart', function(e) {
//     if (e.target.tagName === 'IMG') {
//         e.preventDefault();
//     }
// });

// 防止选择文本（可选）
// document.addEventListener('selectstart', function(e) {
//     e.preventDefault();
//     return false;
// });

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K 聚焦搜索框
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // ESC 关闭模态框
    if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.fixed.inset-0:not(#page-loader)');
        modals.forEach(modal => {
            if (!modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }
    
    // Ctrl/Cmd + D 切换主题
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.click();
        }
    }
    
    // Ctrl/Cmd + ↑ 滚动到顶部
    if ((e.ctrlKey || e.metaKey) && e.key === 'ArrowUp') {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
});