// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 测试：控制台输出，验证JS是否执行
    console.log('核心JS代码已正常执行！');
    // 存储当前选中的下载链接
    let currentDownloadUrl = '';
    
    // ========== 1. 隐藏加载动画 ==========
    setTimeout(function() {
        const loader = document.getElementById('page-loader');
        if(loader) { // 增加判断，避免元素不存在报错
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 300);
        }
    }, 800);
    
    // ========== 2. 初始化AOS动画库 ==========
    if(typeof AOS !== 'undefined') { // 增加判断，避免AOS未加载报错
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
    
    // ========== 3. 移动端菜单切换 ==========
    const mobileMenuBtn = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if(mobileMenuBtn && mobileMenu) { // 增加判断
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // ========== 4. 按钮波纹效果 ==========
    const rippleBtns = document.querySelectorAll('.btn-ripple');
    rippleBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            const ripple = document.createElement('span');
            ripple.style.width = ripple.style.height = Math.max(e.target.offsetWidth, e.target.offsetHeight) + 'px';
            ripple.style.left = x - (parseInt(ripple.style.width) / 2) + 'px';
            ripple.style.top = y - (parseInt(ripple.style.height) / 2) + 'px';
            ripple.classList.add('absolute', 'rounded-full', 'bg-white', 'bg-opacity-30', 'pointer-events-none', 'animate-["ripple_0.6s_ease-out"]');
            this.appendChild(ripple);
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // ========== 5. 下载按钮核心逻辑 ==========
    const downloadBtns = document.querySelectorAll('.download-btn');
    console.log('找到下载按钮数量：', downloadBtns.length); 
    const downloadModal = document.getElementById('download-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelDownloadBtn = document.getElementById('cancel-download');
    const confirmDownloadBtn = document.getElementById('confirm-download');

    // 增加判断，确保元素都存在再绑定事件
    if(downloadBtns.length && downloadModal && modalTitle && modalContent && closeModalBtn && cancelDownloadBtn && confirmDownloadBtn) {
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('点击了立即下载按钮！'); 
                const fileName = this.getAttribute('data-file');
                const fileSize = this.getAttribute('data-size');
                const fileVersion = this.getAttribute('data-version');
                currentDownloadUrl = this.getAttribute('data-download-url');
                
                // 填充模态框内容
                modalTitle.textContent = `下载 ${fileName}`;
                modalContent.textContent = `你确定要下载 ${fileName} (版本: ${fileVersion}, 大小: ${fileSize}) 吗？`;
                
                // 显示模态框
                downloadModal.classList.remove('hidden');
                downloadModal.style.opacity = '1';
                document.body.style.overflow = 'hidden'; 
            });
        });

        // 关闭模态框通用方法
        function closeModal() {
            downloadModal.style.opacity = '0';
            setTimeout(() => {
                downloadModal.classList.add('hidden');
                document.body.style.overflow = 'auto'; 
                currentDownloadUrl = ''; 
            }, 300);
        }

        // 绑定模态框关闭事件
        closeModalBtn.addEventListener('click', closeModal);
        cancelDownloadBtn.addEventListener('click', closeModal);
        downloadModal.addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        // 确认下载核心逻辑
        confirmDownloadBtn.addEventListener('click', function() {
            if (!currentDownloadUrl || currentDownloadUrl.trim() === '') {
                showNotification('下载链接未配置，暂无法下载！');
                closeModal();
                return;
            }
            if (currentDownloadUrl === '待补充') {
                showNotification('该启动器下载链接暂未更新，敬请期待！');
                closeModal();
                return;
            }

            let finalDownloadUrl = currentDownloadUrl;
            if (finalDownloadUrl.includes('github.com') && finalDownloadUrl.includes('/blob/')) {
                finalDownloadUrl = finalDownloadUrl.replace('/blob/', '/raw/');
            }

            try {
                const downloadWindow = window.open(finalDownloadUrl, '_blank');
                if (!downloadWindow) {
                    showNotification('下载被浏览器拦截！请允许网站弹窗后重试');
                } else {
                    showNotification('下载已开始！请在新窗口确认下载');
                }
            } catch (err) {
                showNotification('下载触发失败：' + err.message);
            }

            closeModal();
        });
    }
    
    // ========== 6. 通知提示功能 ==========
    function showNotification(text) {
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        if(notification && notificationText) { // 增加判断
            notificationText.textContent = text;
            notification.style.transform = 'translate-y(0)';
            notification.style.opacity = '1';
            setTimeout(() => {
                notification.style.transform = 'translate-y(20px)';
                notification.style.opacity = '0';
            }, 3000);
        }
    }
    
    // ========== 7. 滚动到顶部功能 ==========
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    if(scrollTopBtn) { // 增加判断
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollTopBtn.style.transform = 'translate-y(0)';
                scrollTopBtn.style.opacity = '1';
            } else {
                scrollTopBtn.style.transform = 'translate-y(20px)';
                scrollTopBtn.style.opacity = '0';
            }
        });
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // ========== 8. 主题切换功能 ==========
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    if(themeToggle && themeToggleMobile) { // 增加判断
        let isDarkMode = false;
        function toggleTheme() {
            isDarkMode = !isDarkMode;
            const body = document.body;
            if (isDarkMode) {
                body.classList.remove('bg-light', 'text-dark');
                body.classList.add('bg-dark', 'text-light');
                themeToggle.innerHTML = '<i class="fa fa-sun-o"></i>';
                themeToggleMobile.innerHTML = '<i class="fa fa-sun-o"></i>';
            } else {
                body.classList.remove('bg-dark', 'text-light');
                body.classList.add('bg-light', 'text-dark');
                themeToggle.innerHTML = '<i class="fa fa-moon-o"></i>';
                themeToggleMobile.innerHTML = '<i class="fa fa-moon-o"></i>';
            }
        }
        themeToggle.addEventListener('click', toggleTheme);
        themeToggleMobile.addEventListener('click', toggleTheme);
    }
    
    // ========== 9. 搜索功能 ==========
    const searchBtn = document.getElementById('search-button');
    const searchInput = document.getElementById('search-input');
    if(searchBtn && searchInput) { // 增加判断
        searchBtn.addEventListener('click', function() {
            const searchText = searchInput.value.trim();
            searchText ? showNotification(`正在搜索: ${searchText}`) : showNotification('请输入搜索内容');
        });
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') searchBtn.click();
        });
    }

    // ========== 10. MC点击特效（核心修复：解决白屏+更多图标+低重复） ==========
    // 扩充后的MC主题图标库
    const mcPixelItems = [
        '⚔️', '⛏️', '🪓', '🗡️', '💰', '💎', '🪨', '🌾', '🍞', '🏹',
        '🧱', '🔥', '💧', '✨', '🍖', '🥩', '🥚', '🍎', '🍄', '🌱',
        '⛰️', '🧪', '🔮', '⚗️', '🏺'
    ];

    // 全页面点击触发（简化去重逻辑，避免出错）
    document.addEventListener('click', function(e) {
        try { // 增加try-catch，防止特效代码出错影响整个页面
            const itemCount = Math.floor(Math.random() * 4) + 6; // 6-9个
            const usedItems = []; // 记录已使用的图标
            
            for (let i = 0; i < itemCount; i++) {
                // 先选未使用的图标，用完再随机选
                let randomItem;
                if(usedItems.length < mcPixelItems.length) {
                    do {
                        randomItem = mcPixelItems[Math.floor(Math.random() * mcPixelItems.length)];
                    } while(usedItems.includes(randomItem));
                    usedItems.push(randomItem);
                } else {
                    randomItem = mcPixelItems[Math.floor(Math.random() * mcPixelItems.length)];
                }
                
                // 创建特效元素
                const effect = document.createElement('span');
                effect.className = 'mc-click-effect';
                effect.textContent = randomItem;
                effect.style.left = e.clientX + 'px';
                effect.style.top = e.clientY + 'px';
                
                // 随机颜色
                const mcColors = ['#4A6FE3', '#4CAF50', '#FFD700', '#8C8C8C', '#E53935', '#9C27B0', '#FF9800', '#00BCD4'];
                effect.style.color = mcColors[Math.floor(Math.random() * mcColors.length)];
                
                // 随机偏移
                const randomX = (Math.random() - 0.5) * 220;
                const randomY = (Math.random() - 0.5) * 220;
                effect.style.setProperty('--random-x', randomX + 'px');
                effect.style.setProperty('--random-y', randomY + 'px');
                
                document.body.appendChild(effect);
                setTimeout(() => {
                    effect.remove();
                }, 1000);
            }
        } catch(err) {
            console.log('特效生成出错:', err); // 出错只打印日志，不影响页面
        }
    });
});